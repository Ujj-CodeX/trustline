from rest_framework import serializers
from .models import Helpline

class HelplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Helpline
        fields = '__all__' 

