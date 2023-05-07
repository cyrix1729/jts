from django.urls import path, re_path, include, reverse_lazy
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import UserViewSet
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('pings/', views.pings_api),
    path('signup/', views.signup, name='signup'),
    
    #JWT authentication urls
    path('auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    #voting urls
    path('pings/<int:pk>/upvote/', views.upvote_ping, name='upvote_ping'),
    path('pings/<int:pk>/downvote/', views.downvote_ping, name='downvote_ping'),
    path('pings/<int:pk>/cancel_vote/', views.cancel_vote, name='cancel_vote'),
    
    #comments urls
    path('pings/<int:pk>/comments/', views.get_comments, name='get_comments'),
    path('pings/<int:pk>/create_comment/', views.create_comment, name='create_comment'),
    path('comments/<int:pk>/delete/', views.delete_comment, name='delete_comment'),
]

router = DefaultRouter()
router.register('CustomUser', UserViewSet, basename='user')
urlpatterns += router.urls