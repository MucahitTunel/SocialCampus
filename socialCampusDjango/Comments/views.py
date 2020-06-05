from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import JsonResponse
from rest_framework import status
from .models import Comments
from Users.models import Kullanicilar
from Subjects.models import Subjects
from PopularComments.models import PopularComments

from Subjects.serializers import subjectSerializer
from Users.serializers import kullanicilarSerializers
from PopularComments.serializers import PopularCommentSerializer
from .serializers import CommentSerializer
# Create your views here.

class GetComments(APIView):

    def post(self, request,format=None, *args, **kwargs):

        data = request.data["_parts"][0]
        mail = request.data["_parts"][1]

        id = data[1]
        mail = mail[1]
        list = []

        hata = 0

        try:
            comment_list = Comments.objects.filter(Subject_Id=id)
            comment_serializer = CommentSerializer(comment_list, many=True)
            print("*************************************")
            print(comment_serializer.data)
            query = Comments.objects.filter(Subject_Id=id).values("Kullanici_Id")
            arr = []
            for i in range(len(query)):
                arr.append(query[i]["Kullanici_Id"])

            user_list = Kullanicilar.objects.filter(id__in=arr)
            user_serializer = kullanicilarSerializers(user_list, many=True)
            print("*************************************")
            print(user_serializer.data)
            subject_list = Subjects.objects.filter(id=id)
            subject_serializer = subjectSerializer(subject_list, many=True)
            print("*************************************")
            print(subject_serializer.data)

            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"];

            popularComment_list = PopularComments.objects.filter(Subject_Id = id, User_Id = userId)
            popularComment_serializer = PopularCommentSerializer(popularComment_list, many=True)
            print(popularComment_serializer.data)
        except:
            hata = 1

        if hata == 0:
            context = {
                'comments': comment_serializer.data,
                'users': user_serializer.data,
                'subject': subject_serializer.data,
                'popular': popularComment_serializer.data,
            }

            return JsonResponse(context, safe=False)
        else:
            context = {
                'hata': "hata",
            }
            return JsonResponse(context, safe=False)



"""

Yorum ekleme sayfası


"""

class AddComments(APIView):

    def post(self, request,format=None, *args, **kwargs):

        id = request.data["_parts"][0]
        mail = request.data["_parts"][1]
        comment = request.data["_parts"][2]

        print(id)
        print(mail)
        print(comment)

        hata = 0
        try:
            Comments.objects.create(Comment = comment[1],
                                    Kullanici_Id = Kullanicilar.objects.get(Email = mail[1]),
                                    Subject_Id = Subjects.objects.get(id=id[1]))
        except:
            hata = 1


        if hata == 1:
            return JsonResponse({"message" : "0"})
        else:
            return JsonResponse({"message" : "1"})
