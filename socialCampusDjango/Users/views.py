from django.shortcuts import render
from rest_framework.views import APIView
from .models import Kullanicilar, Blocks
from .serializers import kullanicilarSerializers, BlockSerializer
from .serializers import getIdSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from django.core.mail import send_mail
import random
from django.db.models import Q
from .serializers import getUserSerializer
import json

# Create your views here.

class KullaniciData(APIView):

    def post(self, request):

        Email = request.data["_parts"][0]
        Password = request.data["_parts"][1]



        print(Email)
        print(Password)

        rest_list = Kullanicilar.objects.filter(Email=Email[1].strip(), Sifre=Password[1])
        print(len(rest_list))

        if len(rest_list) >= 1:
            return JsonResponse({'message': '1'})
        else:
            return JsonResponse({'message': '0'})


class KullaniciKayit(APIView):

    def post(self, request,format=None, *args, **kwargs):

        Email = request.data["Email"]
        Password = request.data["Password"]
        Username = request.data["Username"]
        Ad = request.data["Name"]
        Soyad = request.data["Surname"]
        Image = request.data["Image"]


        rest_list = Kullanicilar.objects.filter(Q(Email=Email.strip()) | Q(Kullanici_Adi = Username))

        if len(rest_list) >= 1:
            return JsonResponse({'message': '0'})
        else:
            Kullanicilar.objects.create(Email=Email.strip(), Sifre=Password,Kullanici_Adi = Username, Ad=Ad.strip(), Soyad=Soyad.strip(), Image=Image)
            return JsonResponse({'message': '1'})


class ForgetPassword(APIView):

    def post(self, request):
        Mail = request.data['Mail']


        rest_list = Kullanicilar.objects.filter(Email=Mail)
        if len(rest_list) >= 1:
            deger = ""
            for i in range(1, 10):
                rastgele = random.randint(1, 9)
                deger = deger + str(rastgele)

            send_mail('Şifremi Unuttum',
                      'Yeni Şifreniz: ' + deger,
                      'mucahit.tunel42@gmail.com',
                      [Mail.strip()],
                      fail_silently=False,
                      )

            Kullanicilar.objects.filter(Email=Mail.strip()).update(Sifre=deger)
            rest_list = Kullanicilar.objects.filter(Email=Mail.strip(), Sifre=deger)
            if len(rest_list) >= 1:
                return JsonResponse({'message': '1'})
            else:
                return JsonResponse({'message': '0'})

        else:
            return JsonResponse({'message': '-1'})


class Profile(APIView):

    def post(self, request):
        print(request.data)
        Mail = request.data["_parts"][0]

        hata = 0

        print(Mail)
        try:
            rest_list = Kullanicilar.objects.filter(Email=Mail[1])
        except:
            hata = 1

        serializer = getUserSerializer(rest_list, many=True)
        print(hata)
        print(rest_list)

        if hata == 0:
            return JsonResponse(serializer.data, safe=False)
        else:
            return JsonResponse({"message":"0"})


class GetProfiles(APIView):

    def post(self, request):
        id = request.data["_parts"][0]
        mail = request.data["_parts"][1]



        print(id)
        print(mail)


        hata = 0

        try:
            deger = Kullanicilar.objects.filter(Email=mail[1]).values("id")
            user_id = deger[0]["id"]


            myblock = Blocks.objects.filter(My_Id=user_id, Block_Id=id[1])
            block = Blocks.objects.filter(My_Id=id[1], Block_Id=user_id)

            print(myblock)
            print(block)


            if len(block) > 0 or len(myblock) > 0:
                engel = "True"
            else:
                engel = "False"

            rest_list = Kullanicilar.objects.filter(id=id[1])
        except:
            hata = 1

        serializer = getUserSerializer(rest_list, many=True)
        print(hata)
        print(rest_list)

        if hata == 0:
            context = {
                "Profile" : serializer.data,
                "Engel" : engel
            }
            return JsonResponse(context, safe=False)
        else:
            return JsonResponse([])


class UpdateProfile(APIView):

    def post(self, request):

        print("ppppppppppoooooooooooooossssssssssssssssttttttttttttttt")
        print(request.data)
        Mail = request.data["Email"]
        #Kullanıcı adı değişti mi değişmedi mi
        UsernameControl = request.data["UsernameControl"]

        if UsernameControl == "1":
            Username = request.data["Username"]
            ImageControl = request.data["ImageControl"]
            if ImageControl == "1":
                Image = request.data["Image"]
        else:
            ImageControl = request.data["ImageControl"]
            if ImageControl == "1":
                Image = request.data["Image"]



        hata = 0
        try:

            if UsernameControl == "1":
                print("Username Control")
                print(Username)
                deger = Kullanicilar.objects.filter(Kullanici_Adi = Username)
                print("uzunuluk ******************")
                print(len(deger))
                print("uzunuluk ******************")
                if len(deger) > 0:
                    return JsonResponse({"message":"Kullanıcı Adı Kullanılmakta"}, safe=False)


            if UsernameControl == "1" and ImageControl == "1":
                print("1")
                Kullanicilar.objects.filter(Email=Mail).update(Kullanici_Adi = Username,
                                                                  Image = Image)

            elif UsernameControl == "1" and ImageControl == "0":
                print("2")
                Kullanicilar.objects.filter(Email=Mail).update(Kullanici_Adi=Username)

            elif UsernameControl == "0" and ImageControl == "1":
                print("3")
                deger=Kullanicilar.objects.get(Email=Mail)
                deger.Image = Image
                deger.save()
            else:
                print("4")



        except:
            hata = 1

        print(hata)

        if hata == 1:
            return JsonResponse({"message":"1"}, safe=False)
        else:
            return JsonResponse({"message": "0"}, safe=False)



class GetId(APIView):



    def post(self, request):
        mail = request.data["mail"]
        print(mail)

        hata = 0

        try:

            deger = Kullanicilar.objects.filter(Email=mail).values("id")
            user_id = deger[0]["id"]
            print(user_id)

            block_list = Blocks.objects.filter(My_Id=user_id)
            block_serializer = BlockSerializer(block_list, many=True)


            rest_list = Kullanicilar.objects.filter(Email=mail)
            serializer = getIdSerializer(rest_list, many=True)

        except:
            hata = 1



        if hata == 0:
            context = {
                "Id" : serializer.data,
                "Block": block_serializer.data
            }
            return JsonResponse(context, safe=False)
        else:
            return JsonResponse([], safe=False)


class GetUsers(APIView):

    def post(self, request):
        keys = request.data["_parts"][0]
        mail = request.data["_parts"][1]
        mail = mail[1]
        keys = keys[1]



        hata = 0

        try:

            deger = Kullanicilar.objects.filter(Email=mail).values("id")
            user_id = deger[0]["id"]

            arr = []
            block = []
            for i in keys:
                arr.append(int(i))
                engel = Blocks.objects.filter(My_Id=int(i), Block_Id=user_id)
                if len(engel) > 0:
                    context = {
                        "id" : int(i),
                        "state" : True
                    }
                    block.append(context)
                else:
                    context = {
                        "id": int(i),
                        "state": False
                    }
                    block.append(context)

            list = Kullanicilar.objects.filter(id__in=arr)
            serializer = getUserSerializer(list, many=True)
        except:
            hata = 1


        if hata == 0:
            context = {
                "Users" : serializer.data,
                "Block" : json.dumps(block)
            }
            return JsonResponse(context, safe=False)
        else:
            return JsonResponse([], safe=False)


class DeleteUser(APIView):

    def post(self, request):
        mail = request.data["_parts"][0]
        mail = mail[1]


        hata = 0

        try:
            list = Kullanicilar.objects.filter(Email=mail).delete()

        except:
            hata = 1




        if hata == 0:
            return JsonResponse({"message":"1"}, safe=False)
        else:
            return JsonResponse({"message":"0"}, safe=False)





class AddBlock(APIView):

    def post(self, request):
        mail = request.data["_parts"][0]
        block_id = request.data["_parts"][1]
        mail = mail[1]
        block_id = block_id[1]


        hata = 0

        try:
            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"];

            Blocks.objects.create(My_Id = Kullanicilar.objects.get(Email=mail),
                                  Block_Id = block_id)

        except:
            hata = 1


        if hata == 0:
            return JsonResponse({"message":"1"}, safe=False)
        else:
            return JsonResponse({"message":"0"}, safe=False)


class MyBlocks(APIView):

    def post(self, request):
        mail = request.data["_parts"][0]
        mail = mail[1]

        print(mail)

        hata = 0

        try:
            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"];


            data = Blocks.objects.filter(My_Id = userId).values("Block_Id")

            arr = []

            for i in range(len(data)):
                arr.append(data[i]["Block_Id"])

            print(arr)

            rest_list = Kullanicilar.objects.filter(id__in = arr)
            serializer = getUserSerializer(rest_list, many=True)

        except:
            hata = 1


        if hata == 0:
            return JsonResponse(serializer.data, safe=False)
        else:
            return JsonResponse({"message":"hata"}, safe=False)



class ignoreBlock(APIView):

    def post(self, request):
        mail = request.data["_parts"][0]
        id = request.data["_parts"][1]
        mail = mail[1]
        id = id[1]


        hata = 0

        try:
            userId = Kullanicilar.objects.filter(Email=mail).values("id")
            userId = userId[0]["id"];

            Blocks.objects.filter(My_Id=userId, Block_Id=id).delete()

            data = Blocks.objects.filter(My_Id = userId).values("Block_Id")

            arr = []

            for i in range(len(data)):
                arr.append(data[i]["Block_Id"])

            print(arr)

            rest_list = Kullanicilar.objects.filter(id__in = arr)
            serializer = getUserSerializer(rest_list, many=True)

        except:
            hata = 1


        if hata == 0:
            context = {
                "data": serializer.data,
                "message": "1"
            }
            return JsonResponse(context, safe=False)
        else:
            context = {
                "data": serializer.data,
                "message": "0"
            }
            return JsonResponse(context, safe=False)


