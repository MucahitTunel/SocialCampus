from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from rest_framework import status

from .models import Map
from .serializers import MapSerializer
import json


import datetime

# Create your views here.
class GetMap(APIView):

    def post(self, request):
        id = request.data["_parts"][0]

        hata = 0

        try:
            rest_list = Map.objects.filter(Activity_Id=id[1])
        except:
            hata = 1

        if hata == 1:
            data = []
            JsonResponse(data, safe=False)
        else:
            serializers = MapSerializer(rest_list, many=True)
            return JsonResponse(serializers.data, safe=False)