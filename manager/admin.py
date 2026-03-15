from django.contrib import admin
from .models import Login,Save,member,Borrowed
# Register your models here.
admin.site.register(Login)
admin.site.register(Save)
admin.site.register(member)
admin.site.register(Borrowed)