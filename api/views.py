from django.http import HttpResponse, JsonResponse
from .models import CustomUser, Ping, Comment
from .serializers import UserSerializer, PingSerializer, CommentSerializer
from rest_framework.response import Response 
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth import get_user_model
from rest_framework import status
from .managers import *
from django.shortcuts import get_object_or_404

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
        pings = Ping.objects.select_related('creator').all()  
        serializer = PingSerializer(pings, many=True)
        return JsonResponse({'pings': serializer.data})

    if request.method == 'POST':
        serializer = PingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse('None')



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upvote_ping(request, pk):
    user = request.user
    ping = get_object_or_404(Ping, pk=pk)

    if user not in ping.voters.all():
        ping.votes += 1
        ping.voters.add(user)
        ping.save()
        return JsonResponse({'message': 'Upvoted successfully', 'votes': ping.votes})
    else:
        return JsonResponse({'message': 'User has already voted', 'votes': ping.votes}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def downvote_ping(request, pk):
    user = request.user
    ping = get_object_or_404(Ping, pk=pk)

    if user not in ping.voters.all():
        ping.votes -= 1
        ping.voters.add(user)
        ping.save()
        return JsonResponse({'message': 'Downvoted successfully', 'votes': ping.votes})
    else:
        return JsonResponse({'message': 'User has already voted', 'votes': ping.votes}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_vote(request, pk):
    user = request.user
    ping = get_object_or_404(Ping, pk=pk)

    if user in ping.voters.all():
        # Determine if the user upvoted or downvoted the ping
        if ping.votes > 0:
            ping.votes -= 1
        else:
            ping.votes += 1

        ping.voters.remove(user)
        ping.save()
        return JsonResponse({'message': 'Vote canceled successfully', 'votes': ping.votes})
    else:
        return JsonResponse({'message': 'User has not voted on this ping', 'votes': ping.votes}, status=400)



class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return get_user_model().objects.filter(pk=user.pk)


@api_view(['GET'])
def get_comments(request, pk):
    print('reached')
    ping = get_object_or_404(Ping, pk=pk)
    comments = Comment.objects.filter(ping=ping)
    serializer = CommentSerializer(comments, many=True)
    return Response({'comments': serializer.data}) 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):
    ping = get_object_or_404(Ping, pk=pk)
    user = request.user
    data = request.data
    data['ping'] = pk

    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        comment = serializer.save(creator=user)  # Set the creator here
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    user = request.user
    if comment.ping.creator == user:
        comment.delete()
        return JsonResponse({'message': 'Comment deleted successfully'})
    else:
        return JsonResponse({'message': 'You are not allowed to delete this comment'}, status=400)