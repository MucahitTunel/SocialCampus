from rest_framework import serializers
from .models import PopularSubjects

class PopularSubjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = PopularSubjects
        fields = '__all__'