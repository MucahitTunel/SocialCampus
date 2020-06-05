from django.db import models
from Users.models import Kullanicilar

# Create your models here.
class Subjects(models.Model):
    Subject = models.TextField()
    Date = models.DateTimeField()
    Created_By = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)
    Like = models.IntegerField(default=0)
    Dislike = models.IntegerField(default=0)

    def __str__(self):
        return self.Subject