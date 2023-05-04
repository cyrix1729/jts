from django.http import HttpResponse, JsonResponse
from .models import CustomUser, Ping
from .serializers import UserSerializer, PingSerializer
from rest_framework.response import Response 
from rest_framework.decorators import api_view 
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth import get_user_model
from rest_framework import status
from .managers import *

def index(request):
    return HttpResponse('Api index')

@api_view(['POST'])
def signup(request):
    # Create a new user
    required_fields = ['email', 'alias', 'password']
    if all(field in request.data for field in required_fields):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'id': user.id, 'email': user.email, 'alias': user.alias}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        missing_fields = [field for field in required_fields if field not in request.data]
        return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def pings_api(request):
    if request.method == 'GET':
        print('GET RECEIVED')
        pings = Ping.objects.all()
        serializer = PingSerializer(pings, many=True)
        return JsonResponse({'pings': serializer.data})

    if request.method == 'POST':
        serializer = PingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse('None')

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return get_user_model().objects.filter(pk=user.pk)
