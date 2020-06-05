from django.db import models
from Market.models import Market
from Users.models import Kullanicilar

# Create your models here.

class Fpgrowth(models.Model):
    Market_Id = models.ForeignKey(Market, on_delete=models.CASCADE)
    Kullanici_Id = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)
