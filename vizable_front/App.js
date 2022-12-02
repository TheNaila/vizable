//Concept and code reference credits to Aditya's tutorials and freecodecamp
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import React, { useEffect, useReducer, useRef, useState } from "react";

import {
  StatusBar,
  Text,
  Button,
  View,
} from "react-native";

//setting our initial app state
const cameraState = {
  cameraType: "back",
  flash: "off",
  zoomValue: 0,
};

export default function App() {
  state = cameraState;

//checking device permissions for camera
  const [hasPermission, setHasPermission] = useState(null);
  const { cameraType } = state;

  const camera =  useState();

//function for clicking picture
  const clickPicture = async () => {    
      let photo = await camera.current.takePictureAsync();
      const image_location = photo.uri; //store the cache location of the image
      camera.current.pausePreview();
      await savePicture(image_location); //save it to the camera roll
      camera.current.resumePreview();
  };

//saving the image to camera roll
  const savePicture = async (photo: string) => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY); 
    //write status, we will need read status later for python script
    if (status === "granted") {
      const assert = await MediaLibrary.createAssetAsync(photo);
      await MediaLibrary.createAlbumAsync("Vizapp", assert); //creates an album called vizapp in user's gallery
      console.log("taken picture");
    } else {
      console.log("Please provide permission to use the gallery to store picture");
    }
  };

//here is where we ask our user to grant permissions
    useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Please provide access to your camera</Text>;
  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <Camera
        ref={camera}
        style={{ flex: 1 }}
        type={cameraType}
      />
      <Button title ="Take Picture" size={100} onPress={clickPicture} />
      </View>

  );
}
