from rest_framework import serializers
from .models import Market, Images

class MarketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Market
        fields = '__all__'


class ImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = '__all__'
