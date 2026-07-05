from django.shortcuts import render,redirect
from functools import wraps
from django.http import HttpResponse
from .models import Login,Save,member,Borrowed
from django.db.models import Q
from django.contrib import messages
# Create your views here.
# def login_required(view_func):
#     @wraps(view_func)
#     def wrapper(request,*args,**kwargs)
def index(request):
    if request.method=="POST":
        name=request.POST.get('username')
        password=int(request.POST.get('password'))
        try:
            n=Login.objects.get(Name=name)
            if n.Password==password:
                print(n.Password)
                return redirect('Home')
            else:
                messages.error(request,'Password does not match')
                return redirect('index')
        except Login.DoesNotExist:
            messages.error(request,'User name does not match')
    return render(request,'Login.html')
def home(request):
    query=request.GET.get('q','')
    if query:
        book=Save.objects.filter(
            Q(title__icontains=query)|
            Q(Author__icontains=query)|
            Q(Category__icontains=query)
        )
    else:
        book = Save.objects.all()
    return render(request, 'Home.html', {"Book": book})
def save(request):
    if request.method=="POST":
        Tittle=request.POST.get('tittle')
        author=request.POST.get('Author')
        category = request.POST.get('category')
        publish_date=request.POST.get('publish_date')
        Desc=request.POST.get('Desc')
        quantity=request.POST.get('quantity')
        Image=request.FILES.get('image')
        Save.objects.create(
            title=Tittle,
            Author=author,
            p_date=publish_date,
            Description=Desc,
            Category=category,
            Quantity=quantity,
            image=Image
        )
    return render(request,'Add_Book.html')
def members(request):
        if request.method == "POST":
            name= request.POST.get('name')
            email = request.POST.get('email')
            password = request.POST.get('password')
            address = request.POST.get('address')
            Image = request.FILES.get('image')
            member.objects.create(
                Name=name,
                Email=email,
                Password=password,
                Address=address,
                image=Image
            )
        return render(request,'Add_member.html')
def users(request):
    query = request.GET.get('q', '')
    if query:
        user = member.objects.filter(
            Q(m_id__icontains=query) |
            Q(Name__icontains=query) |
            Q(Email__icontains=query)
        )
    else:
        user=member.objects.all()
    return render(request,'Users.html',{'member':user})
def borrowReq(request):
    a=Borrowed.objects.filter(Status__iexact='pending')
    return render(request,'Brequest.html',{'B':a})
def Approve(request,b_id):
    if request.method=='POST':
        borrow=Borrowed.objects.get(b_id=b_id)
        borrow.Status='Approved'
        borrow.save()
        '''to decrease the quantity of book after approval'''
        Quant=Save.objects.get(id=borrow.book_id)
        Quant.Quantity-=1
        Quant.save()
    return redirect('bReq')
def Borroweds(request):
    query = request.GET.get('q', '')
    if query:
        Borrows = Borrowed.objects.filter(
            Q(b_id__icontains=query) |
            Q(m_id__icontains=query)
        )
    else:
        Borrows=Borrowed.objects.filter(Status='Approved')
    return render(request,'Borroweds.html',{'B':Borrows})
def returns(request):
    a=Borrowed.objects.filter(Status__iexact='Returned Request')
    return render(request,'Return.html',{'B':a})
def retapprove(request,id):
    if request.method=="POST":
        borrow = Borrowed.objects.get(b_id=id)
        borrow.Status = 'Returned'
        borrow.save()
        incre = Save.objects.get(id=borrow.book_id)
        incre.Quantity += 1
        incre.save()
    return redirect('Returneds')


