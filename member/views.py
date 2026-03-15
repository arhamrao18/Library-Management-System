from django.shortcuts import render,redirect
from django.contrib import messages
from functools import wraps
from django.http import HttpResponse
from manager.models import member,Save,Borrowed
from django.contrib.auth.decorators import login_required
from django.db.models import Q
# Create your views here.
def member_login(view_func):
    @wraps(view_func)
    def wrapper(request,*args,**kwargs):
        if 'user_id' not in request.session:
            return redirect('login')
        return view_func(request,*args,**kwargs)
    return wrapper
def login(request):
    if request.method=="POST":
        try:
            email=request.POST.get('email')
            password=request.POST.get('password')
            # m = member.objects.get(Email=email, Password=password)
            # if(member.objects.filter(Email=email, Password=password)).exists():
            m=member.objects.get(Email=email)
            if m.Password==password:
               # m.m_id ka mtlb hai us member ki id
                request.session['req']=[]
                request.session['user_id']=m.m_id
                return redirect('Menue')
            else:
                messages.error(request,'Password does not match')
                return redirect('login')
        except member.DoesNotExist:
            messages.error(request,'Email does not match')

    return render(request,'students/login.html')
@member_login
def Menue(request):
    query=request.GET.get('q','')
    if query:
        data=Save.objects.filter(
            Q(title__icontains=query) |
            Q(Author__icontains=query) |
            Q(Category__icontains=query)
        )
    else:
        data=Save.objects.all()
    return render(request,'students/index.html',{'Data':data})
def profile(request):
    user_id=request.session['user_id']
    n=member.objects.get(m_id=user_id)
    return render(request,'students/I.html',{'N':n})
def getreq(request,myid):
    n=Save.objects.get(id=myid)
    borrow=request.session.get('user_id')
    Already=Borrowed.objects.filter(i_id=borrow,book_id=myid).exists()
    if Already:
        messages.error(request,'You can borrow one book of same tittle')
    else:
        if n.Quantity>1:
            m = member.objects.get(m_id=borrow)
            if m:
                 Borrowed.objects.create(
            Name=m.Name,
            i_id=m.m_id,
            Email=m.Email,
            Address=m.Address,
            Book=n.title,
            book_id=n.id
                )
            messages.success(request,"Request is submitted!")
            return Menue(request)
        else:
             messages.error(request,"Sorry! Book is not available")
             return Menue(request)
    return Menue(request)

def Req(request):
    m=request.session.get('user_id')
    b=Borrowed.objects.filter(i_id=m)
    ids=[]
    for i in b:
        ids.append(i.book_id)
    book=Save.objects.filter(id__in=ids)
    return render(request,'students/Request.html',{'Book':book,'N':b})
def cancelreq(request,r_id):
    n=request.session.get('user_id')
    cancel = Borrowed.objects.filter(i_id=n, book_id=r_id)
    cancel.delete()
    messages.success(request,"Book request has been cancelled")
    return redirect('Request')
def returned(request,g_id):
    if request.method=="POST":
        n=request.session.get('user_id')
        wapsi=Borrowed.objects.get(i_id=n,book_id=g_id)
        wapsi.Status='Returned Request'
        wapsi.save()
        messages.success(request,"Return request has been submitted!")
    return redirect('Request')
def password(request):
    user_id=request.session.get('user_id')
    n=member.objects.get(m_id=user_id)
    if request.method=="Post":
        old=request.POST.get('old_password','')
        new=request.POST.get('new_password','')
        confirm=request.POST.get('confirm_password','')
        if old!=n.Password:
            messages.error(request,'Old Password is not correct')
        elif confirm!=new:
            messages.error(request,'Confirm password is not equal to new password')
        elif new==old:
            messages.error(request,'Password should not match your previous!')
        else:
            n.Password=new
            n.save()
            messages.success(request,'Password is changed successfully')
        return redirect('Profile')
    return redirect(profile)

