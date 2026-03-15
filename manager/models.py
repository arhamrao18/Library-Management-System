from django.db import models

# Create your models here.
class Login(models.Model):
    Name=models.CharField(max_length=100)
    Password=models.IntegerField()
class Save(models.Model):
    id=models.AutoField(primary_key=True)
    title=models.CharField(max_length=500)
    Author=models.CharField(max_length=100)
    p_date=models.DateTimeField()
    Description=models.CharField(max_length=1000)
    Category=models.CharField(max_length=200,default='')
    Quantity=models.IntegerField(default=0)
    image=models.ImageField(upload_to='image')
    def __str__(self):
        return self.title
class member(models.Model):
    m_id=models.AutoField(primary_key=True)
    Name=models.CharField(max_length=100)
    Email=models.CharField(max_length=100)
    Password=models.CharField(max_length=10,default='')
    Address=models.CharField(max_length=500)
    image=models.ImageField(upload_to='image')
    def __str__(self):
        return self.Name
class Borrowed(models.Model):
    b_id=models.AutoField(primary_key=True)
    i_id=models.IntegerField(max_length=20,default=0)
    book_id = models.IntegerField(default=0)
    Name=models.CharField(max_length=50)
    Email=models.CharField(max_length=100)
    Address=models.CharField(max_length=200)
    Book=models.CharField(max_length=50,default='')
    Status=models.CharField(max_length=20,default='pending')
    def __str__(self):
        return self.Name


