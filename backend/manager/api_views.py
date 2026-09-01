from rest_framework import viewsets, APIView
from .models import Login, member, Save, Borrowed, MembershipFee
from .serializers import LoginSerializer, MemberSerializer, SaveSerializer, BorrowedSerializer, MembershipFeeSerializer
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.core.management import call_command

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = SaveSerializer
    permission_classes = [IsAuthenticated]

    '''Query for searching books by title, author, or category'''
    def get_queryset(self):
        qs = Save.objects.all()
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(Author__icontains=q) | Q(Category__icontains=q))
        return qs

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    '''Query for searching members by name or email'''

    def get_queryset(self):
        qs = member.objects.all()
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(Q(Name__icontains=q) | Q(Email__icontains=q))
        return qs

class BorrowedViewSet(viewsets.ModelViewSet):
    serializer_class = BorrowedSerializer
    permission_classes = [IsAuthenticated]

    '''Query for searching borrowed books by status'''

    def get_queryset(self):
        qs = Borrowed.objects.all()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(Status__iexact=status_param)
        return qs


    '''Action to approve a borrowed book and update the book quantity'''
    
    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        borrow = self.get_object()
        borrow.Status = 'Approved'
        borrow.save()
        book = Save.objects.get(id=borrow.book_id)
        book.Quantity -= 1
        book.save()
        return Response({'message': 'Approved'})


    '''Action to approve the return of a borrowed book and update the book quantity'''

    @action(detail=True, methods=['patch'])
    def approve_return(self, request, pk=None):
        borrow = self.get_object()
        borrow.Status = 'Returned'
        borrow.save()
        book = Save.objects.get(id=borrow.book_id)
        book.Quantity += 1
        book.save()
        return Response({'message': 'Returned'})
    
class GenerateFeesView(APIView):
    """
    Admin-triggered endpoint that manually runs the same logic as the
    'generate_fees' management command — creates this month's fee record
    for every member and marks overdue ones with a fine.
    Only logged-in admins (Django auth User) can call this.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        call_command('generate_fees')
        return Response({'detail': 'Fee generation completed successfully.'})
    


class MembershipFeeViewSet(viewsets.ModelViewSet):
    """
    Admin-facing endpoint for viewing and managing membership fees.
    Supports filtering by status and month via query params, e.g.:
    /api/fees/?status=Overdue
    /api/fees/?month=2026-09-01
    """
    queryset = MembershipFee.objects.select_related('member').all().order_by('-month', 'member__Name')
    serializer_class = MembershipFeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        month_filter = self.request.query_params.get('month')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if month_filter:
            qs = qs.filter(month=month_filter)
        return qs