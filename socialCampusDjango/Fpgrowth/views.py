from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import JsonResponse
from rest_framework import status
from Users.models import Kullanicilar
from Users.serializers import kullanicilarSerializers
from .models import Fpgrowth

from pyfpgrowth import pyfpgrowth


class AddData(APIView):
    def get(self, request):

        veriler = Fpgrowth.objects.all().values().order_by("Kullanici_Id_id")
        print(veriler)
        data = []
        toplamdata = []
        tempid = veriler[0]["Kullanici_Id_id"]
        for i in range(len(veriler)):
            id = veriler[i]["Kullanici_Id_id"]
            market = veriler[i]["Market_Id_id"]
            if id == tempid:
                data.append(market)
                if i == len(veriler)-1:
                    toplamdata.append(data)
            else:
                toplamdata.append(data)
                data = []
                data.append(market)
                tempid = id

        print(toplamdata)

        patterns = pyfpgrowth.find_frequent_patterns(toplamdata, 2)
        print(patterns)
        print("**************")
        rules = pyfpgrowth.generate_association_rules(patterns, 0.7)
        print(rules)


        temp = []
        dictList = []



        for key, value in rules.items():
            temp = [key, value]
            dictList.append(temp)
        print("--------------------------------")

        for i in range(len(dictList)):
            solboyut = dictList[i][0]
            if(len(solboyut) > 0):
                value = dictList[i][1][0][0]
                if value == 6:
                    sonuc = dictList[i][0]
                    break

        datas = [i for i in sonuc]
        print(datas)


        return JsonResponse([], safe=False);
