from django.http import HttpResponse, JsonResponse
from .models import CustomUser, Ping
from .serializers import UserSerializer, PingSerializer
from rest_framework.response import Response 
from rest_framework.decorators import api_view 
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth import get_user_model
from .managers import *

def index(request):
    return HttpResponse('Api index')



@api_view(['POST'])
def signup(request):
    # Create a new user
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'id': user.id, 'email': user.email}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def pings_api(request):
    if request.method == 'GET':
        print('GET RECEIVED')
        pings = Ping.objects.all()
        serializer = PingSerializer(pings, many = True)
        # return Response(serializer.data) 
        return JsonResponse({'pings': serializer.data})
    
    if request.method =='POST':
        serializer = PingSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_created)
    return HttpResponse('None')
        
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()

# @api_view(['GET'])
# def users_api(request):
#     users = CustomUser.objects.all()
#     serializer = UserSerializer(users, many = True)
#     return JsonResponse({'users':serializer.data})

