from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import subjectSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework import status
from .models import Subjects
import json

from Users.models import Kullanicilar
from Users.serializers import kullanicilarSerializers

from Activities.models import Activities
from Activities.serializers import ActivitiesSerializer

from Users.models import Kullanicilar
from Users.serializers import kullanicilarSerializers

from Comments.models import Comments
from Comments.serializers import CommentSerializer

from PopularSubjects.models import PopularSubjects
from PopularSubjects.serializers import PopularSubjectSerializer

from django.db.models import F

import datetime

# Create your views here.
class GetSubjectData(APIView):

    def post(self, request):

        mail = request.data["mail"]
        print(mail)


        hata = 0
        subjectId = []
        arr = []

        commentCount = []
        try:
            rest_list = Subjects.objects.all()
            serializers = subjectSerializer(rest_list, many=True)

            for i in range(len(rest_list)):
                subjectId.append(serializers.data[i]["id"])
                arr.append(serializers.data[i]["Created_By"])



            arr = set(arr)
            arr = list(arr)

            kullanici_list = Kullanicilar.objects.filter(id__in=arr)
            kullanici_serialize = kullanicilarSerializers(kullanici_list, many=True)

            for j in subjectId:
                comment_list = Comments.objects.filter(Subject_Id = j).count()
                commentCount.append({str(j):comment_list})

            print(commentCount)

            id = Kullanicilar.objects.filter(Email=mail).values("id")

            id = id[0]["id"]

            popularSubject_list = PopularSubjects.objects.filter(User_Id=id)
            popularSubject_serializer = PopularSubjectSerializer(popularSubject_list, many=True)
        except:
            hata = 1


            print(hata)


        if hata == 0:
            context = {
                "Subject" : serializers.data,
                "Users" : kullanici_serialize.data,
                "Count" : commentCount,
                "PopularSubjects": popularSubject_serializer.data,
            }
        else:
            context = {
                "message" : "0"
            }


        return JsonResponse(context, safe=False)



class UploadSubjectData(APIView):

    def post(self, request,format=None, *args, **kwargs):

        subject = request.data["_parts"][1]
        mail = request.data["_parts"][0]
        now = datetime.datetime.now()
        hata = 0

        print(subject)
        print(mail)

        try:
            Subjects.objects.create(Subject=subject[1],
                                    Date=now,
                                    Created_By=Kullanicilar.objects.get(Email=mail[1]))
        except:
            hata = 1

        if hata == 1:
            return JsonResponse({"message":"0"})
        else:
            return JsonResponse({"message":"1"})



"""
    Konu, aktivite, kullanıcı araması burada yapılacak
"""

class SearchData(APIView):

    def post(self, request,format=None, *args, **kwargs):

        search = request.data["_parts"][0]
        footer = request.data["_parts"][1]

        print(search[1])

        hata = 0

        if footer[1] == 1:
            try:
                rest_list = Kullanicilar.objects.filter(Kullanici_Adi__contains=search[1])
                serializer = kullanicilarSerializers(rest_list, many=True)
                print(rest_list)
            except:
                hata = 1

            print(hata)
            print("hesap")

            if hata == 0:
                return JsonResponse(serializer.data, safe=False)
            else:
                return JsonResponse([], safe=False)

        elif footer[1] == 2:
            try:
                rest_list = Activities.objects.filter(Content__contains=search[1])
                serializer = ActivitiesSerializer(rest_list, many=True)
                print(rest_list)
            except:
                hata = 1

            print(hata)
            print("etkinlik")

            if hata == 0:
                return JsonResponse(serializer.data, safe=False)
            else:
                return JsonResponse([], safe=False)
        else:
            try:
                rest_list = Subjects.objects.filter(Subject__contains=search[1])
                serializer = subjectSerializer(rest_list, many=True)
                print(rest_list)
            except:
                hata = 1

            print(hata)
            print("konu")

            if hata == 0:
                return JsonResponse(serializer.data, safe=False)
            else:
                return JsonResponse([], safe=False)



class getMySubjects(APIView):
    def post(self, request):
        mail = request.data["mail"]
        print(mail)

        hata = 0
        subjectId = []
        arr = []

        commentCount = []
        try:
            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"]

            rest_list = Subjects.objects.filter(Created_By=userId)
            serializers = subjectSerializer(rest_list, many=True)

            for i in range(len(rest_list)):
                subjectId.append(serializers.data[i]["id"])
                arr.append(serializers.data[i]["Created_By"])

            arr = set(arr)
            arr = list(arr)

            kullanici_list = Kullanicilar.objects.filter(id__in=arr)
            kullanici_serialize = kullanicilarSerializers(kullanici_list, many=True)

            for j in subjectId:
                comment_list = Comments.objects.filter(Subject_Id=j).count()
                commentCount.append({str(j): comment_list})

            print(commentCount)

            id = Kullanicilar.objects.filter(Email=mail).values("id")

            id = id[0]["id"]

            popularSubject_list = PopularSubjects.objects.filter(User_Id=id)
            popularSubject_serializer = PopularSubjectSerializer(popularSubject_list, many=True)
        except:
            hata = 1

            print(hata)

        if hata == 0:
            context = {
                "Subject": serializers.data,
                "Users": kullanici_serialize.data,
                "Count": commentCount,
                "PopularSubjects": popularSubject_serializer.data,
            }
        else:
            context = {
                "message": "0"
            }

        return JsonResponse(context, safe=False)



class DeleteSubjects(APIView):
    def post(self, request):
        mail = request.data["_parts"][0]
        deleteid = request.data["_parts"][1]
        mail = mail[1]
        deleteid = deleteid[1]

        hata = 0
        subjectId = []
        arr = []

        commentCount = []
        try:

            Subjects.objects.filter(id=deleteid).delete()

            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"]

            rest_list = Subjects.objects.filter(Created_By=userId)
            serializers = subjectSerializer(rest_list, many=True)

            for i in range(len(rest_list)):
                subjectId.append(serializers.data[i]["id"])
                arr.append(serializers.data[i]["Created_By"])

            arr = set(arr)
            arr = list(arr)

            kullanici_list = Kullanicilar.objects.filter(id__in=arr)
            kullanici_serialize = kullanicilarSerializers(kullanici_list, many=True)

            for j in subjectId:
                comment_list = Comments.objects.filter(Subject_Id=j).count()
                commentCount.append({str(j): comment_list})

            print(commentCount)

            id = Kullanicilar.objects.filter(Email=mail).values("id")

            id = id[0]["id"]

            popularSubject_list = PopularSubjects.objects.filter(User_Id=id)
            popularSubject_serializer = PopularSubjectSerializer(popularSubject_list, many=True)
        except:
            hata = 1

            print(hata)

        if hata == 0:
            context = {
                "Subject": serializers.data,
                "Users": kullanici_serialize.data,
                "Count": commentCount,
                "PopularSubjects": popularSubject_serializer.data,
                "message":"1"
            }
        else:
            context = {
                "message": "0"
            }

        return JsonResponse(context, safe=False)



