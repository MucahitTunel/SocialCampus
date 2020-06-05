from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ActivitiesSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework import status
from .models import Activities
from Users.models import Kullanicilar
from Map.models import Map

from Users.serializers import kullanicilarSerializers

# Create your views here.

class UploadData(APIView):

    #parser_classes = (MultiPartParser, FormParser)
    def post(self, request,format=None, *args, **kwargs):

        #file_serializers = ActivitiesSerializer(data=request.data)


        type = request.data["Type"]
        content = request.data["Content"]
        image = request.data["Image"]
        address = request.data["Address"]
        date = request.data["Date"]
        price = request.data["Price"]
        hour = request.data["Hour"]
        mail = request.data["Email"]
        longitude = request.data["Longitude"]
        latitude = request.data["Latitude"]


        print(image)


        hata = 0

        try:
            if longitude == "yok":
                Activities.objects.create(Type=type,
                                          Content=content,
                                          Image=image,
                                          Address=address,
                                          Price=price,
                                          Hour=hour,
                                          Date=date,
                                          Kayit=Kullanicilar.objects.get(Email=mail))
            else:
                Activities.objects.create(Type=type,
                                          Content=content,
                                          Image=image,
                                          Address=address,
                                          Price=price,
                                          Hour=hour,
                                          Date=date,
                                          Longitude=longitude,
                                          Latitude=latitude,
                                          Kayit=Kullanicilar.objects.get(Email=mail))


        except:
            hata = 1


        if hata == 1:
            print("return 0")
            return JsonResponse({"message":"0"}, safe=False)
        else:
            print("return 1")
            return JsonResponse({"message":"1"}, safe=False)


class GetData(APIView):

    def get(self, request):

        rest_list = Activities.objects.all()
        serializers = ActivitiesSerializer(rest_list, many=True)


        return JsonResponse(serializers.data, safe=False)




class Detail(APIView):

    def post(self, request):

        data = request.data["id"]
        hata = 0

        try:
            rest_list = Activities.objects.filter(id=data)

            deger = Activities.objects.filter(id=data).values("Kayit")
            user_id = deger[0]["Kayit"]

            user_list = Kullanicilar.objects.filter(id=deger[0]["Kayit"])

        except:
            hata = 1

        print("**************************")
        print(hata)
        print("**************************")

        if hata == 1:
            context = {
                "Data": [],
                "User": []
            }
            return JsonResponse(context, safe=False)
        else:

            serializers = ActivitiesSerializer(rest_list, many=True)
            user_serializer = kullanicilarSerializers(user_list, many=True)

            context = {
                "Data": serializers.data,
                "User": user_serializer.data
            }

            return JsonResponse(context, safe=False)


class deleteActivity(APIView):
    def post(self, request):
        id = request.data["id"]

        print(id)
        hata = 0

        try:
            Activities.objects.filter(id=id).delete()
        except:
            hata = 1

        print(hata)

        if hata == 1:
            return JsonResponse({"message": "1"}, safe=False)
        else:
            return JsonResponse({"message": "0"}, safe=False)


class MyActivities(APIView):
    def post(self, request):
        mail = request.data["_parts"][0]
        mail = mail[1]


        hata = 0

        try:
            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"];
            rest_list = Activities.objects.filter(Kayit=userId)
            serializer = ActivitiesSerializer(rest_list, many=True)

        except:
            hata = 1

        print(hata)

        if hata == 1:
            return JsonResponse({"message": "0"}, safe=False)
        else:
            return JsonResponse(serializer.data, safe=False)
