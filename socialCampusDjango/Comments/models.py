from django.db import models
from Users.models import Kullanicilar
from Subjects.models import Subjects
import datetime
# Create your models here.
class Comments(models.Model):

    Comment = models.TextField()
    Kullanici_Id = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)
    Subject_Id = models.ForeignKey(Subjects, on_delete=models.CASCADE)
    Date = models.DateTimeField(default=datetime.datetime.now())
    Like = models.IntegerField(default=0)
    Dislike = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)
