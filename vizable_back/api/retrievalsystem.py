import numpy as np
import torch
import clip
import matplotlib
from PIL import Image
import pandas as pd
from vizwiz_captions.vizwiz_api.vizwiz import VizWiz
import json
import requests
from io import BytesIO
import pathlib
import gc
import torch.nn as nn
import os

from deep_translator import GoogleTranslator
from gtts import gTTS

class VizWizData():
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, self.preprocess = clip.load("ViT-B/32", device=self.device)
        
        self.backend_path = str(pathlib.Path(__name__).parent.resolve())
        json_dir = self.backend_path + '/vizwiz_captions/annotations/val.json'
        vizwiz = VizWiz(json_dir, ignore_rejected=True, ignore_precanned=True)
        df = pd.DataFrame(vizwiz.anns).transpose()
        data = json.load(open(json_dir))
        imgs = data["images"]
        ids = []
        filenames = []
        for img in imgs:
            ids.append(img["id"])
            filenames.append(img["file_name"])
        df_ids = df["image_id"]
        image_jpgs = []
        for id in df_ids:
            ind = ids.index(id)
            image_jpgs.append(filenames[ind])
        df["file_name"] = image_jpgs
        # can improve preprocessing here

        self.df = df
        self.images_names = df["file_name"].unique()
        self.captions = df.groupby(["file_name"]).first()["caption"]
        
        # load default/ existing encodings
        self.text_encodings = torch.load(self.backend_path + '/vizwiz_captions/encodings/val_text_encodings.pt')
        self.image_encodings = torch.load(self.backend_path + '/vizwiz_captions/encodings/val_image_encodings.pt')
        


    def load_image(self, file_name, is_viz = True, url_header = 'https://vizwiz.cs.colorado.edu/VizWiz_visualization_img/'):
        if is_viz:
            header = url_header + file_name
        else:
            header = file_name
        return Image.open(BytesIO(requests.get(header).content))

    
    def single_encoding(self, query, is_PIL=False, is_image=True, is_viz = True):
        with torch.no_grad():
            if is_image and not is_PIL:
                PIL_image = self.load_image(query,is_viz=is_viz)
                encoded = self.model.encode_image(self.preprocess(PIL_image).unsqueeze(0).to(self.device))
                del PIL_image
                gc.collect()
            elif is_image and is_PIL:
                PIL_image = Image.open(query)
                encoded = self.model.encode_image(self.preprocess(PIL_image).unsqueeze(0).to(self.device))
                del PIL_image
                gc.collect()
            else:
                encoded = self.model.encode_text(clip.tokenize(query,truncate=True)).to(self.device)
            encoded /= encoded.norm(dim=-1, keepdim=True)

        return encoded
    
    def render_tensor(self, create_filename, lst, are_images=True):
        encodings = []
        if are_images: # image encoding result
            loaded_imgs = []
            for name in lst:
                loaded_imgs.append(self.load_image(name))
            while loaded_imgs:
                photo = loaded_imgs[-1]
                loaded_imgs.pop()
                image_input = self.preprocess(photo).unsqueeze(0).to(self.device)
                del photo
                gc.collect()
                with torch.no_grad():
                    # Encode and normalize the search query using CLIP
                    image_encoded = self.model.encode_image(image_input)
                    image_encoded /= image_encoded.norm(dim=-1, keepdim=True)
                    # Append image encoding vector to list for querying
                    encodings.append(image_encoded)
        else:
            for caption in lst:
                with torch.no_grad():
                    text_features = self.model.encode_text(clip.tokenize(caption,truncate=True).to(self.device))
                    text_features /= text_features.norm(dim=-1, keepdim=True)
                encodings.append(text_features)

        encodings_tensor = torch.stack(encodings)
        torch.save(encodings_tensor, self.backend_path + '/vizwiz_captions/encodings/' + create_filename + '.pt')
        return encodings_tensor
    
    def search_vizwiz(self, search_query, is_PIL, is_image, encodings_matrix, results_count=1):
        # Encode the search query
        if is_image and "VizWiz" not in search_query:
            query_features = self.single_encoding(search_query, is_PIL=is_PIL, is_image=True, is_viz=False)
        else:
            query_features = self.single_encoding(search_query, is_image=is_image, is_viz=True)
        # Compute Cosine similarities as logits
        logit_scale_exp = nn.Parameter(torch.ones([]) * np.log(1 / 0.07)).exp()
        similarity_matrix = logit_scale_exp * (encodings_matrix @ query_features.T).T
        sorted, indices = similarity_matrix.sort(descending=True)
        
        df_inds = indices.tolist()[0][0][:results_count]
        res = []
        if not is_image:
            find_images = self.images_names[df_inds]
            for element in find_images:
                res.append(self.load_image(element))
        else:
            res = self.captions[df_inds]
        return res

class Extensions():
    def __init__(self, default_lang = 'en'):
        self.default_lang = default_lang
    def translation_function(self, captions):
        translated_text = GoogleTranslator(source='auto', target=self.default_lang).translate_batch(captions) 
        return translated_text
    def multilingual_speech(self, mytext):
        # Passing the text and language to the engine, 
        # here we have marked slow=False. Which tells 
        # the module that the converted audio should 
        # have a high speed
        myobj = gTTS(text=mytext, lang=self.default_lang, slow=False)
        
        # Saving the converted audio in a mp3
        myobj.save("test.mp3")
        
        # # Playing the converted file
        # os.system("mpg321 welcome.mp3")
