from rest_framework import serializers
from .models import CustomUser, Ping
from django.contrib.auth import get_user_model
from .managers import CustomUserManager

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'
        
    def create(self, validated_data):
        user_manager = CustomUserManager()
        user = user_manager.create_user(email=validated_data['email'], password=validated_data['password'])
        return user
        
        
class PingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ping
        fields = '__all__'
        
    