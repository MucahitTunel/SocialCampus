from django.db import models
from Activities.models import Activities
# Create your models here.

class Map(models.Model):
    Longitude = models.FloatField(null=False, verbose_name="Boylam")
    Latitude = models.FloatField(null=False, verbose_name="Enlem")
    Activity_Id = models.ForeignKey(Activities, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)