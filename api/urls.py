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
    path('auth/', include('rest_framework.urls')),
    path('signup/', views.signup, name='signup'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

router = DefaultRouter()
router.register('CustomUser', UserViewSet, basename='user')
urlpatterns += router.urls