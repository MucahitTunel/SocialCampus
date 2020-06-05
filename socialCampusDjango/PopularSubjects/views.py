from rest_framework import status
from .models import PopularSubjects
from .serializers import PopularSubjectSerializer
from django.http import JsonResponse
from rest_framework.views import APIView

from Subjects.models import Subjects
from Subjects.serializers import subjectSerializer

from Users.models import Kullanicilar

from django.db.models import F



# Create your views here.
class AddPopularSubjects(APIView):

    def post(self, request):


        SubjectId = request.data["_parts"][0]
        Mail = request.data["_parts"][1]

        hata = 0

        try:
            id = Kullanicilar.objects.filter(Email=Mail[1]).values("id")
            id = id[0]["id"]
            list = PopularSubjects.objects.filter(Subject_Id = SubjectId[1], User_Id=id)



            if len(list) >= 1:
                PopularSubjects.objects.filter(Subject_Id=SubjectId[1], User_Id=id).delete()
                Subjects.objects.filter(id=SubjectId[1]).update(Like=F('Like') - 1)
            else:
                PopularSubjects.objects.create(Subject_Id=Subjects.objects.get(id=SubjectId[1]),
                                               User_Id = Kullanicilar.objects.get(id=id))
                Subjects.objects.filter(id=SubjectId[1]).update(Like=F('Like') + 1)



            subject_list = Subjects.objects.all()
            subject_serializer = subjectSerializer(subject_list, many=True)

            popularSubject_list = PopularSubjects.objects.filter(User_Id=id)
            popularSubject_serializer = PopularSubjectSerializer(popularSubject_list, many=True)

        except:
            print("Hata oluştu")
            hata = 1



        if hata == 0:
            context = {
                "subjects" : subject_serializer.data,
                "popularSubjects" : popularSubject_serializer.data
            }
            return JsonResponse(context, safe=False)
        else:
            context = {
                "subjects": [],
                "popularSubjects": []
            }
            return JsonResponse(context, safe=False)

