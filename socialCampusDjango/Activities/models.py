from django.db import models
from django.utils.text import slugify
import os
from Users.models import Kullanicilar

# Create your models here.
class Activities(models.Model):

    def get_upload_path(instance, filename):
        name, ext = os.path.splitext(filename)
        return os.path.join('activities/{}'.format(instance.id), slugify(name) + ext)


    Type = models.CharField(max_length=16, verbose_name="Tür")
    Content = models.TextField(verbose_name="Açıklama")
    Image = models.FileField(upload_to= get_upload_path, null=True, verbose_name="Resim")
    Address = models.TextField(verbose_name="Adres")
    Price = models.CharField(max_length=16,null=True, verbose_name="Ücret")
    Hour = models.CharField(max_length=16, verbose_name="Saat", null=True)
    Date = models.CharField(max_length=30,verbose_name="Tarih")
    Kayit = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE,related_name='Create_Id')
    Longitude = models.FloatField(null=True, verbose_name="Boylam")
    Latitude = models.FloatField(null=True, verbose_name="Enlem")

    def __str__(self):
        return str(self.id)