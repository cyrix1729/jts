from django.contrib import admin
from .models import Ping, CustomUser, Path

admin.site.register(Ping)
admin.site.register(CustomUser)
admin.site.register(Path)

