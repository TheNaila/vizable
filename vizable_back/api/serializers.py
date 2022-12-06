from rest_framework import serializers
from .models import Retrieval

class CaptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retrieval
        fields = ['cover']