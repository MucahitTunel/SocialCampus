from rest_framework import serializers
from .models import Kullanicilar, Blocks

class kullanicilarSerializers(serializers.ModelSerializer):

    class Meta:
        model = Kullanicilar
        fields = '__all__'


class getUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=Kullanicilar
        fields = ('id','Email', 'Kullanici_Adi','Yetki','Ad','Soyad','Image')

class getIdSerializer(serializers.ModelSerializer):
    class Meta:
        model=Kullanicilar
        fields = ('id', 'Email')


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blocks
        fields = '__all__'



