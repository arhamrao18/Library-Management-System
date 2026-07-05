from django.http import HttpResponse
from django.shortcuts import render,redirect
def start(request):
    return render(request,'start.html')