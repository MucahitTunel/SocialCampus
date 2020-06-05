from django.db import models
from Subjects.models import Subjects
from Users.models import Kullanicilar

# Create your models here.
class PopularSubjects(models.Model):

    User_Id = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)
    Subject_Id = models.ForeignKey(Subjects, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)