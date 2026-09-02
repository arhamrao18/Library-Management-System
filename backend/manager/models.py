from django.db import models
from django.utils import timezone
from datetime import timedelta
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
    Password=models.CharField(max_length=200,default='')
    Address=models.CharField(max_length=500)
    image=models.ImageField(upload_to='image')
    def __str__(self):
        return self.Name
    

    
BORROW_PERIOD_DAYS = 15   # how many days a member can keep a book before it's due
BOOK_FINE_PER_DAY = 10    # Rs. per day late, for overdue books


class Borrowed(models.Model):
    b_id=models.AutoField(primary_key=True)
    i_id=models.IntegerField(max_length=20,default=0)
    book_id = models.IntegerField(default=0)
    Name=models.CharField(max_length=50)
    Email=models.CharField(max_length=100)
    Address=models.CharField(max_length=200)
    Book=models.CharField(max_length=50,default='')
    Status=models.CharField(max_length=20,default='pending')

    # New fields for the due-date/fine system
    borrow_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)
    fine_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return self.Name

    @property
    def is_overdue(self):
        # Only counts as overdue while the book is still out (Approved) and past due_date
        if self.Status == 'Approved' and self.due_date:
            return timezone.now().date() > self.due_date
        return False






MONTHLY_FEE_AMOUNT = 500  
FEE_DUE_DAY = 5           
FINE_PER_DAY = 20        


class MembershipFee(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
    ]

    member = models.ForeignKey('manager.member', on_delete=models.CASCADE, related_name='fees')
    month = models.DateField()            # e.g. 2026-09-01  (month ka pehla din — record identify karne ke liye)
    due_date = models.DateField()         # e.g. 2026-09-05
    amount = models.DecimalField(max_digits=8, decimal_places=2, default=MONTHLY_FEE_AMOUNT)
    fine_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    paid_date = models.DateTimeField(null=True, blank=True)
    stripe_session_id = models.CharField(max_length=200, null=True, blank=True)
    receipt_id = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        unique_together = ('member', 'month')   # one member must have only one fee record per month
        ordering = ['-month']

    def __str__(self):
        return f"{self.member.Name} - {self.month.strftime('%B %Y')} - {self.status}"

    def calculate_fine(self):
        """Agar due date guzar gayi ho aur abhi tak Pending hai, to fine calculate karo."""
        if self.status == 'Pending' and timezone.now().date() > self.due_date:
            days_late = (timezone.now().date() - self.due_date).days
            self.fine_amount = days_late * FINE_PER_DAY
            self.status = 'Overdue'
            self.save()
        return self.fine_amount

    @property
    def total_due(self):
        return float(self.amount) + float(self.fine_amount)