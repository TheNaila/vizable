from urllib import request
from django.db import models
# from django.core.files import File

# Create your models here.
class Retieval(models.Model):
    # myfile = request.FILES['image']
    # image = request.FILES.get('myfile') # change myfile to input type name
    # image_file = File(image)
    # image_path = image_file.path
    # image = models.ImageField(upload_to='profile_images', null=True)
    # see: https://docs.djangoproject.com/en/4.0/ref/models/fields/#django.db.models.fields.files.FieldFile.path
    title = models.TextField()
    cover = models.ImageField(upload_to='images/')
    def __str__(self):
        return self.title
