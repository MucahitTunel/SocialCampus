from django.db import models
from django.utils.text import slugify
import os
# Create your models here.
class Kullanicilar(models.Model):

    def get_upload_path(instance, filename):
        name, ext = os.path.splitext(filename)
        return os.path.join('users/{}'.format(instance.pk), slugify(name) + ext)

    Email = models.EmailField(verbose_name="Email")
    Sifre = models.CharField(max_length=16, verbose_name="Şifre")
    Kullanici_Adi = models.CharField(max_length=16, verbose_name="Kullanıcı Adı")
    Yetki = models.CharField(default="Kullanıcı", verbose_name="Yetki", max_length=16)
    Ad = models.CharField(max_length=32, verbose_name="Ad")
    Soyad = models.CharField(max_length=32, verbose_name="Soyad")
    Image = models.FileField(upload_to=get_upload_path, null=True, verbose_name="Resim")

    def __str__(self):
        return self.Email



class Blocks(models.Model):
    My_Id = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE, verbose_name="Benim id")
    Block_Id = models.IntegerField(verbose_name="Engellenen id")

    def __str__(self):
        return str(self.id)