from django.urls import path
from .views import *

urlpatterns = [
    path('results/', RetrievalView.as_view(), name="caption_result"),
]

