from django.urls import path
from . import views
urlpatterns=[
path('',views.index,name='index'),
path('home/',views.home,name='Home'),
path('add/',views.save,name='Add'),
path('members/',views.members,name='Member'),
path('users/',views.users,name='Users'),
path('Breq/',views.borrowReq,name='bReq'),
path('Approve/<int:b_id>/',views.Approve,name='Approved'),
path('Borros/',views.Borroweds,name='Borrow'),
path('rets/',views.returns,name='Returneds'),
path('retA/<int:id>/',views.retapprove,name='Rapprove'),

]