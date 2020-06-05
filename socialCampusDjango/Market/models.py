from django.db import models
from Users.models import Kullanicilar
from django.utils.text import slugify
import os
import datetime
# Create your models here.
class Market(models.Model):
    Title = models.CharField(max_length=128, verbose_name="Başlık", null=False)
    Price = models.IntegerField(verbose_name="Ücret")
    Status = models.CharField(max_length=128, verbose_name="Ürün Durumu", null=False)
    Description = models.CharField(max_length=512,verbose_name="Açıklama" ,null=False)
    Category = models.CharField(max_length=128, verbose_name="Kategori", null=False)
    Longitude = models.FloatField(null=False, verbose_name="Boylam")
    Latitude = models.FloatField(null=False, verbose_name="Enlem")
    Created_By = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)
    Date = models.DateTimeField(default=datetime.datetime.now())


    def __str__(self):
        return str(self.id)


class Images(models.Model):
    def get_upload_path(instance, filename):
        name, ext = os.path.splitext(filename)
        return os.path.join('market/{}'.format(instance.id), slugify(name) + ext)

    Market_Id = models.ForeignKey(Market, on_delete=models.CASCADE)
    Image = models.FileField(upload_to=get_upload_path, null=True, verbose_name="Resim")

    def __str__(self):
        return str(self.Market_Id)


class Favorites(models.Model):
    User_Id = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)
    Market_Id = models.ForeignKey(Market, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)


