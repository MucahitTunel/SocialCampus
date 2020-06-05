from rest_framework import serializers
from .models import PopularComments

class PopularCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = PopularComments
        fields = '__all__'