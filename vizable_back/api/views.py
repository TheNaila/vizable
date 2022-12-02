from http.client import HTTPResponse
from urllib import request
from django.shortcuts import render

from .models import Retrieval
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from vizable_back.api.models import Retievals
from retrievalsystem import VizWizData
from django.http import JsonResponse

# Create your views here.
# if 'upload-profile-photo' in request.POST:
#     retrieval_instance = request.FILES["myfile"]
#     retrieval_instance.save()
#     return HTTPResponse("Success")

class RetrievalView(viewsets.ModelViewSet):
    queryset = Retrieval.objects.all()

@api_view(["POST"])
def getcaption(request):
    try:
        # Get image objects from request
        source_image = request.FILES['Image']

        # Pass image object to image processing and get a resulting caption
        best_caption = VizWizData.search_vizwiz(source_image, True, True, VizWizData.text_encodings)

        return JsonResponse('Best Caption: {}'.format(best_caption), safe=False)
    except ValueError as e:
        return Response(e.args[0], status.HTTP_400_BAD_REQUEST)

# useful resources:
# https://forum.djangoproject.com/t/development-of-an-image-processing-application-on-back-end/1788/4
