from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import JsonResponse
from rest_framework import status
from .models import PopularComments
from .serializers import PopularCommentSerializer

from Comments.models import Comments
from Subjects.models import Subjects
from Users.models import Kullanicilar

from Comments.serializers import CommentSerializer

from django.db.models import F



# Create your views here.
class AddPopularComments(APIView):

    def post(self, request,format=None, *args, **kwargs):

        SubjectId = request.data["_parts"][0]
        CommentId = request.data["_parts"][1]
        Mail = request.data["_parts"][2]

        Mail = Mail[1]
        print(SubjectId)
        print(CommentId)

        hata = 0

        try:

            id = Kullanicilar.objects.filter(Email=Mail).values("id")
            id = id[0]["id"]
            list = PopularComments.objects.filter(Subject_Id = SubjectId[1],
                                                  Comment_Id = CommentId[1],
                                                  User_Id = id)


            if len(list) >= 1:
                PopularComments.objects.filter(Subject_Id=SubjectId[1],Comment_Id=CommentId[1], User_Id=id).delete()
                Comments.objects.filter(Subject_Id=SubjectId[1], id=CommentId[1]).update(Like=F('Like') - 1)
                comment_list = Comments.objects.filter(Subject_Id=SubjectId[1])
                comment_serializer = CommentSerializer(comment_list, many=True)
            else:
                PopularComments.objects.create(Subject_Id=Subjects.objects.get(id=SubjectId[1]),
                                               Comment_Id=Comments.objects.get(id=CommentId[1]),
                                               User_Id=Kullanicilar.objects.get(id=id))
                Comments.objects.filter(Subject_Id=SubjectId[1], id=CommentId[1]).update(Like=F('Like') + 1)
                comment_list = Comments.objects.filter(Subject_Id=SubjectId[1])
                comment_serializer = CommentSerializer(comment_list, many=True)

            popularComment_list = PopularComments.objects.filter(Subject_Id=SubjectId[1], User_Id=id)
            popularComment_serializer = PopularCommentSerializer(popularComment_list, many=True)
        except:
            print("Hata oluştu")
            hata = 1


        print(hata)

        if hata == 0:
            context = {
                "comments" : comment_serializer.data,
                "popularComments" : popularComment_serializer.data
            }
            return JsonResponse(context, safe=False)
        else:
            context = {
                "comments": [],
                "popularComments": []
            }
            return JsonResponse(context, safe=False)