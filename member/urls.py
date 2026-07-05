from django.urls import path
from . import views
urlpatterns=[
    path('',views.login,name='login'),
    path('menue/',views.Menue,name='Menue'),
    path('mine/',views.profile,name='Profile'),
    path('req/',views.Req,name='Request'),
    path('cancel/<int:r_id>/',views.cancelreq,name='Cancel'),
    path('getreq/<int:myid>/',views.getreq,name='Getreq'),
    path('ret/<int:g_id>/',views.returned,name='Return'),
    path('chng/',views.password,name='change_password')
]