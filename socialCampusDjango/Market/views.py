from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework import status

from Fpgrowth.models import Fpgrowth
from Fpgrowth.serializers import FpgrowthSerializer

from .models import Market
from .serializers import MarketSerializer

from .models import Images
from .serializers import ImageSerializers

from .models import Favorites


from Users.models import Kullanicilar
from Users.serializers import kullanicilarSerializers

from .helpers import modify_input_for_multiple_files

from Users.models import Kullanicilar
import datetime
from pyfpgrowth import pyfpgrowth

# Create your views here.
class UploadMarket(APIView):

    def get(self, request):
        return JsonResponse([], safe=False)

    def post(self, request):

        Title = request.data["Title"]
        Price = request.data["Price"]
        Status = request.data["Status"]
        Description = request.data["Description"]
        Category = request.data["Category"]
        Longitude = request.data["Longitude"]
        Latitude = request.data["Latitude"]
        Mail = request.data["Mail"]

        images = dict((request.data).lists())['Image']
        print(Images)

        hata = 0
        try:
            deger = Market.objects.create(Title=Title,
                                  Price=Price,
                                  Status=Status,
                                  Description=Description,
                                  Category=Category,
                                  Longitude=Longitude,
                                  Latitude=Latitude,
                                  Created_By = Kullanicilar.objects.get(Email=Mail))

        except:
            hata = 1

        for img in images:
            Images.objects.create(Market_Id=deger,
                                  Image=img)

        print("Hata: {}".format(hata))

        if hata == 1:

            return JsonResponse({'message': '1'})
        else:
            return JsonResponse({'message': '0'})

class getMarket(APIView):
    def get(self, request):

        query = Market.objects.all().values("id")
        arr = []


        for i in range(len(query)):
            arr.append(query[i]["id"])


        print(arr)
        data=[]
        for value in arr:
            image_list = Images.objects.filter(Market_Id=value)[0:1]
            data.append(image_list[0])

        image_serializer = ImageSerializers(data,many=True)
        print(image_serializer)


        return JsonResponse(image_serializer.data, safe=False)


class Detail(APIView):
    def post(self, request):
        id = request.data["_parts"][0]
        mail = request.data["_parts"][1]

        id = id[1]
        mail = mail[1]

        print(mail)
        print(id)
        hata = 0

        """

            FG-GROWTH

        """

        veriler = Fpgrowth.objects.all().values().order_by("Kullanici_Id_id")
        print(veriler)
        data = []
        toplamdata = []
        tempid = veriler[0]["Kullanici_Id_id"]
        for i in range(len(veriler)):
            kid = veriler[i]["Kullanici_Id_id"]
            market = veriler[i]["Market_Id_id"]
            if kid == tempid:
                data.append(market)
                if i == len(veriler) - 1:
                    toplamdata.append(data)
            else:
                toplamdata.append(data)
                data = []
                data.append(market)
                tempid = kid

        print(toplamdata)

        patterns = pyfpgrowth.find_frequent_patterns(toplamdata, 2)
        print(patterns)

        rules = pyfpgrowth.generate_association_rules(patterns, 0.7)
        print(rules)

        temp = []
        dictList = []

        for key, value in rules.items():
            temp = [key, value]
            dictList.append(temp)

        sonuc = []
        for i in range(len(dictList)):
            solboyut = dictList[i][0]
            if (len(solboyut) > 0):
                value = dictList[i][1][0][0]
                if value == id:
                    sonuc = dictList[i][0]
                    break

        datas = [i for i in sonuc]


        """

            FG-GROWTH

        """
        try:



            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"]


            print(id)
            print(userId)

            fpgwth = Fpgrowth.objects.filter(Market_Id_id=id, Kullanici_Id_id=userId)
            print(fpgwth)

            if len(fpgwth) == 0:
                Fpgrowth.objects.create(Market_Id_id=Market.objects.get(id=id),
                                        Kullanici_Id_id = Kullanicilar.objects.get(id=userId))


            fav = Favorites.objects.filter(User_Id=userId, Market_Id=id)



            market_list = Market.objects.filter(id=id)
            image_list = Images.objects.filter(Market_Id=id)



            deger = Market.objects.filter(id=id).values("Created_By")
            user_id = deger[0]["Created_By"]



            user_list = Kullanicilar.objects.filter(id=deger[0]["Created_By"])

            datalistfpgrowth=[]
            for value in datas:
                fpgrowth_list = Images.objects.filter(Market_Id=value)[0:1]
                datalistfpgrowth.append(fpgrowth_list[0])


            fpgrowth_serializer = ImageSerializers(datalistfpgrowth, many=True)
            market_serializer = MarketSerializer(market_list, many=True)
            image_serializer = ImageSerializers(image_list, many=True)
            user_serializer = kullanicilarSerializers(user_list, many=True)
        except:
            hata = 1


        print(hata)

        if hata == 1:
            context = {
                "Market": [],
                "Image": [],
                "User": [],
                "Fav":"",
                "Fpgrowth": [],
            }
            return JsonResponse(context, safe=False)
        else:
            if len(fav) > 0:
                context = {
                    "Market": market_serializer.data,
                    "Image": image_serializer.data,
                    "User": user_serializer.data,
                    "Fav": "1",
                    "Fpgrowth": fpgrowth_serializer.data,
                }
            else:
                context = {
                    "Market": market_serializer.data,
                    "Image": image_serializer.data,
                    "User": user_serializer.data,
                    "Fav": "0",
                    "Fpgrowth": fpgrowth_serializer.data,
                }
            return JsonResponse(context, safe=False)


class MyMarket(APIView):
    def post(self, request):

        mail=request.data["_parts"][0]

        deger = Kullanicilar.objects.filter(Email=mail[1]).values("id")
        user_id = deger[0]["id"]

        query = Market.objects.filter(Created_By=user_id).values("id")
        arr = []
        for i in range(len(query)):
            arr.append(query[i]["id"])


        data = []
        for value in arr:
            image_list = Images.objects.filter(Market_Id=value)[0:1]
            data.append(image_list[0])

        print(data)

        image_serializer = ImageSerializers(data, many=True)



        return JsonResponse(image_serializer.data, safe=False)


class editMarket(APIView):
    def post(self, request):

        id = request.data["id"]


        hata = 0

        try:
            market_list = Market.objects.filter(id=id)
            market_serializer = MarketSerializer(market_list, many=True)


            image_list = Images.objects.filter(Market_Id=id)
            image_serializer = ImageSerializers(image_list, many=True)
        except:
            hata = 1


        if hata == 1:
            context={
                "message":"1"
            }
            return JsonResponse(context, safe=False)

        else:
            context = {
                "Market":market_serializer.data,
                "Image":image_serializer.data
            }

            return JsonResponse(context, safe=False)


class EditUploadMarket(APIView):
    def post(self, request):
        Title = request.data["Title"]
        Price = request.data["Price"]
        Status = request.data["Status"]
        Description = request.data["Description"]
        Category = request.data["Category"]
        Longitude = request.data["Longitude"]
        Latitude = request.data["Latitude"]
        Mail = request.data["Mail"]
        DeleteCount = request.data["DeleteCount"]
        Count = request.data["Count"]
        MarketId = request.data["MarketId"]

        print(MarketId)
        print(type(MarketId))
        deleteHata = 0
        imageHata = 0

        if int(DeleteCount) > 0:
            print("deleteeeeeeeee")
            deleted = request.data["Delete"]

            degerler = deleted.split(",")
            print(degerler)

            try:
                for i in degerler:
                    Images.objects.filter(id=int(i)).delete()

            except:
                deleteHata=1

        if (int(Count) > 0):
            print("thisssssssssssss")
            images = dict((request.data).lists())['Image']

            mid = int(MarketId)

            try:
                for img in images:
                    Images.objects.create(Market_Id=Market.objects.get(id=mid),
                                          Image=img)

            except:
                imageHata=1


        updateHata = 0

        try:
            Market.objects.filter(id=MarketId).update(Title=Title,
                                                      Price=Price,
                                                      Status=Status,
                                                      Description=Description,
                                                      Category=Category,
                                                      Longitude=Longitude,
                                                      Latitude=Latitude,
                                                      )
        except:
            updateHata=1




        if imageHata==0 and deleteHata==0 and updateHata==0:
            return JsonResponse({"message":"0"}, safe=False)
        else:
            return JsonResponse({"message":"1"}, safe=False)


class deleteMarket(APIView):
    def post(self, request):

        id = request.data["id"]

        print(id)
        hata = 0

        try:
            Market.objects.filter(id=id).delete()
        except:
            hata = 1

        print(hata)

        if hata == 1:
            return JsonResponse({"message":"1"}, safe=False)
        else:
            return JsonResponse({"message":"0"}, safe=False)


class getFilterMarket(APIView):
    def post(self, request):

        type = request.data["type"]

        print(id)
        hata = 0

        try:
            query = Market.objects.filter(Category=type).values("id")
            arr = []
            for i in range(len(query)):
                arr.append(query[i]["id"])

            data = []
            for value in arr:
                image_list = Images.objects.filter(Market_Id=value)[0:1]
                data.append(image_list[0])

            image_serializer = ImageSerializers(data, many=True)
        except:
            hata = 1

        print(hata)

        if hata == 1:
            return JsonResponse([], safe=False)
        else:
            return JsonResponse(image_serializer.data, safe=False)


class Like(APIView):
    def post(self,request):

        Mail = request.data["_parts"][0]
        Id = request.data["_parts"][1]

        Mail = Mail[1]
        Id = Id[1]

        print(Mail)
        print(Id)
        hata = 0


        try:
            print("try")
            userId = Kullanicilar.objects.filter(Email=Mail).values("id")
            userId = userId[0]["id"]

            print("userId")
            print(userId)

            rest_list = Favorites.objects.filter(User_Id = userId, Market_Id=Id)
            if len(rest_list) > 0:
                Favorites.objects.filter(User_Id = userId, Market_Id=Id).delete()
            else:
                Favorites.objects.create(User_Id=Kullanicilar.objects.get(Email=Mail),
                                         Market_Id=Market.objects.get(id=Id))

            rest_list = Favorites.objects.filter(User_Id=userId, Market_Id=Id)

        except:
            hata = 1


        if hata == 1:
            context={
                "Fav":""
            }
            return JsonResponse(context)
        else:
            if len(rest_list) > 0:
                context={
                    "Fav":"1"
                }
                return JsonResponse(context,safe=False)
            else:
                context = {
                    "Fav": "0"
                }
                return JsonResponse(context, safe=False)


class MyFavMarket(APIView):
    def post(self, request):

        mail=request.data["_parts"][0]
        print("Myfavvvvvvvvvv")
        deger = Kullanicilar.objects.filter(Email=mail[1]).values("id")
        user_id = deger[0]["id"]

        query = Favorites.objects.filter(User_Id=user_id).values("Market_Id")

        arr = []
        for i in range(len(query)):
            arr.append(query[i]["Market_Id"])


        data = []
        for value in arr:
            image_list = Images.objects.filter(Market_Id=value)[0:1]
            data.append(image_list[0])

        print(data)

        image_serializer = ImageSerializers(data, many=True)
        return JsonResponse(image_serializer.data, safe=False)


