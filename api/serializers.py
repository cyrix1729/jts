from rest_framework import serializers
from .models import CustomUser, Ping, Comment
from django.contrib.auth import get_user_model
from .managers import CustomUserManager

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'alias', 'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined')

    def create(self, validated_data):
        user = self.Meta.model(email=validated_data['email'], alias=validated_data['alias'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class PingSerializer(serializers.ModelSerializer):
    creator_alias = serializers.StringRelatedField(source='creator.alias', read_only=True)

    class Meta:
        model = Ping
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    creator_alias = serializers.StringRelatedField(source='creator.alias', read_only=True)  

    class Meta:
        model = Comment
        fields = '__all__'