from django.db import models
from Subjects.models import Subjects
from Comments.models import Comments
from Users.models import Kullanicilar

# Create your models here.
class PopularComments(models.Model):

    User_Id = models.ForeignKey(Kullanicilar, on_delete=models.CASCADE)
    Subject_Id = models.ForeignKey(Subjects, on_delete=models.CASCADE)
    Comment_Id = models.ForeignKey(Comments, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)

