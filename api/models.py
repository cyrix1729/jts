from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
    print('TOKEN CREATED')

USER_TYPE_CHOICES = [
    ('jogger', 'Jogger'),
    ('pedestrian', 'Pedestrian')
]

PING_TYPE_CHOICES = [
    ('pavement','Pavement'),
    ('road','Road'),
    ('scenary','Scenary'),
    ('busy','Busy'),
    ('litter','Litter'),
    ('wildlife','Wildlife'),
    ('shops','Shops'),
    ('other','Other'),
]

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    user_type = models.CharField(max_length=50, choices = USER_TYPE_CHOICES, default = 'Jogger')
    USERNAME_FIELD = "email"
    alias = models.TextField(max_length = 25, default = 'user')
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    
    def __str__(self):
        return self.email

    def to_dict(self):
        return {
            'email': self.email,
            'date_joined': self.date_joined,
            'user_type': self.user_type,
            'alias': self.alias,
        }
        
        
#Ping
class Ping(models.Model):
    # ping_type
    ping_type = models.CharField(max_length=50, choices = PING_TYPE_CHOICES)
    
    # location
    lat = models.DecimalField(max_digits=21, decimal_places=18)
    long = models.DecimalField(max_digits=21, decimal_places=18)
    
    # description
    desc = models.CharField(max_length = 200)
    # rating
    rating = models.IntegerField(default=5,
        validators=[
            MaxValueValidator(10),
            MinValueValidator(0)
        ]
    )
    
    #creator
    creator = models.ForeignKey(CustomUser, related_name = 'related_creator', on_delete=models.SET_NULL, blank=False, null=True)
    #votes
    votes = models.IntegerField(default=0)

    #voters
    voters = models.ManyToManyField(CustomUser, related_name= 'related_voters', default=None, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return (self.ping_type)

#path
class Path(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    # start point
    start_lat = models.DecimalField(max_digits=21, decimal_places=18)
    start_long = models.DecimalField(max_digits=21, decimal_places=18)

    # end point
    end_lat = models.DecimalField(max_digits=21, decimal_places=18)
    end_long = models.DecimalField(max_digits=21, decimal_places=18)

    #Many-to-one relationship from user to path. A user can have many journeys. 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return (self.start_lat + self.start_long)
