from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import JsonResponse
from rest_framework import status
from Users.models import Kullanicilar
from Users.serializers import kullanicilarSerializers

from pyfpgrowth import pyfpgrowth


class AddData(APIView):
    def get(self, request):

        data = [
            [1,2,3,4,5,6,7],
            [2,8,7,6,9],
            [3,4,6,2],
            [5,7,9,1],
            [6,8,2,7,4,9],
            [4,8,6,3,2,7]
        ]

        patterns = pyfpgrowth.find_frequent_patterns(data, 4)
        print(patterns)
        rules = pyfpgrowth.generate_association_rules(patterns, 0.7)
        print(rules)

        print(type(rules))



        return JsonResponse([], safe=False);
