from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from manager.models import member, Save, Borrowed,MembershipFee
from manager.serializers import SaveSerializer, MemberSerializer,MembershipFeeSerializer
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password, check_password
import stripe
from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from .authentication import MemberJWTAuthentication

import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

'''Check the member is authorized or not'''

class MemberLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            m = member.objects.get(Email=email)
        except member.DoesNotExist:
            return Response({'detail': 'Email does not match'}, status=400)
        if not check_password(password, m.Password):
            return Response({'detail': 'Password does not match'}, status=400)

        # Issue a JWT tied to this member (member_id claim, not trusted client input)
        refresh = RefreshToken()
        refresh['member_id'] = m.m_id
        data = MemberSerializer(m, context={'request': request}).data
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return Response(data)

'''  index.html  '''

class MemberBooksView(APIView):
    # Public catalog — anyone (even logged out) should be able to browse books
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [AllowAny]
    def get(self, request):
        q = request.query_params.get('q')
        qs = Save.objects.all()
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(Author__icontains=q) | Q(Category__icontains=q))
        return Response(SaveSerializer(qs, many=True, context={'request': request}).data)

'''index.html -> Borrow button (getreq)'''

class MemberBorrowView(APIView):
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        member_id = request.user.m_id
        book_id = request.data.get('book_id')
        try:
            m = member.objects.get(m_id=member_id)
            book = Save.objects.get(id=book_id)
        except (member.DoesNotExist, Save.DoesNotExist):
            return Response({'detail': 'Invalid member or book'}, status=400)
        if Borrowed.objects.filter(i_id=member_id, book_id=book_id).exists():
            return Response({'detail': 'You can borrow one book of same title'}, status=400)
        if book.Quantity < 1:
            return Response({'detail': 'Book is not available'}, status=400)
        Borrowed.objects.create(Name=m.Name, i_id=m.m_id, Email=m.Email,
                                 Address=m.Address, Book=book.title, book_id=book.id)
        return Response({'detail': 'Request submitted'})

'''  Request.html  '''
class MemberRequestsView(APIView):
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        member_id = request.user.m_id
        borrows = Borrowed.objects.filter(i_id=member_id).exclude(Status='Returned')
        data = []
        for b in borrows:
            try:
                book = Save.objects.get(id=b.book_id)
            except Save.DoesNotExist:
                continue
            data.append({
                'book_id': book.id, 'title': book.title, 'Author': book.Author,
                'p_date': book.p_date, 'Category': book.Category,
                'Description': book.Description,
                'image': request.build_absolute_uri(book.image.url) if book.image else None,
                'Status': b.Status,
                'due_date': b.due_date,
                'is_overdue': b.is_overdue,
                'fine_amount': str(b.fine_amount),
                'rejection_reason': b.rejection_reason,
            })
            # Mark rejection as seen the moment the member views this list
            if b.Status == 'Rejected' and not b.seen_by_member:
                b.seen_by_member = True
                b.save()
        return Response(data)
    
'''    Cancel button     '''

class MemberCancelRequestView(APIView):
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self, request, book_id):
        member_id = request.user.m_id
        Borrowed.objects.filter(i_id=member_id, book_id=book_id).delete()
        return Response({'detail': 'Request cancelled'})


'''   Return button  '''

class MemberReturnRequestView(APIView):
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, book_id):
        member_id = request.user.m_id
        try:
            b = Borrowed.objects.get(i_id=member_id, book_id=book_id)
        except Borrowed.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        b.Status = 'Returned Request'
        b.save()
        return Response({'detail': 'Return request submitted'})


'''    Profile view   '''

class MemberProfileView(APIView):
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        member_id = request.user.m_id
        try:
            m = member.objects.get(m_id=member_id)
        except member.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(MemberSerializer(m, context={'request': request}).data)


'''    Change Password form   '''


class MemberChangePasswordView(APIView):
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        member_id = request.user.m_id
        old, new, confirm = request.data.get('old_password'), request.data.get('new_password'), request.data.get('confirm_password')
        try:
            m = member.objects.get(m_id=member_id)
        except member.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        if not check_password(old, m.Password):
            return Response({'detail': 'Old Password is not correct'}, status=400)
        if new != confirm:
            return Response({'detail': 'Confirm password does not match'}, status=400)
        if check_password(new, m.Password):
            return Response({'detail': 'Password should not match your previous!'}, status=400)
        m.Password = make_password(new)
        m.save()
        return Response({'detail': 'Password changed successfully'})
    



class MemberFeesView(APIView):
    """
    Lets a logged-in member view their own membership fee history.
    Uses request.user.m_id (from the JWT) — never trusts a client-supplied member_id.
    """
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        member_id = request.user.m_id
        fees = MembershipFee.objects.filter(member_id=member_id).order_by('-month')
        return Response(MembershipFeeSerializer(fees, many=True, context={'request': request}).data)
    

class MemberNotificationCountView(APIView):
    """
    Returns how many unseen rejection notifications this member has,
    for showing a badge (e.g. red circle with a number) in the sidebar.
    """
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        member_id = request.user.m_id
        count = Borrowed.objects.filter(i_id=member_id, Status='Rejected', seen_by_member=False).count()
        return Response({'unseen_count': count})
    




class CreateCheckoutSessionView(APIView):
    """
    Member clicks "Pay Now" -> this creates a Stripe Checkout Session
    for the given fee and returns the URL to redirect the member to.
    """
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        fee_id = request.data.get('fee_id')
        member_id = request.user.m_id

        try:
            fee = MembershipFee.objects.get(id=fee_id, member_id=member_id)
        except MembershipFee.DoesNotExist:
            return Response({'detail': 'Fee record not found'}, status=404)

        if fee.status == 'Paid':
            return Response({'detail': 'This fee has already been paid'}, status=400)

        # Stripe expects the amount in the smallest currency unit (e.g. paisa, not rupees)
        amount_in_smallest_unit = int(fee.total_due * 100)

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'pkr',
                    'product_data': {
                        'name': f"Membership Fee — {fee.month.strftime('%B %Y')}",
                    },
                    'unit_amount': amount_in_smallest_unit,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{settings.FRONTEND_URL}/member/payment-success?session_id={{CHECKOUT_SESSION_ID}}&fee_id={fee.id}",
            cancel_url=f"{settings.FRONTEND_URL}/member/fees",
        )

        # Save the session id now so we can verify it later
        fee.stripe_session_id = session.id
        fee.save()

        return Response({'checkout_url': session.url})


class ConfirmPaymentView(APIView):
    """
    Called after the member returns from Stripe's Checkout page.
    Verifies the payment directly with Stripe (never trusts the frontend alone),
    then marks the fee as Paid and generates a receipt ID.
    """
    authentication_classes = [MemberJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get('session_id')
        fee_id = request.data.get('fee_id')
        member_id = request.user.m_id

        try:
            fee = MembershipFee.objects.get(id=fee_id, member_id=member_id)
        except MembershipFee.DoesNotExist:
            return Response({'detail': 'Fee record not found'}, status=404)

        if fee.status == 'Paid':
            # Already confirmed earlier — just return the existing receipt
            return Response(MembershipFeeSerializer(fee, context={'request': request}).data)

        # Verify with Stripe directly — this is the real source of truth
        try:
            session = stripe.checkout.Session.retrieve(session_id)
        except stripe.error.StripeError:
            return Response({'detail': 'Could not verify payment with Stripe'}, status=400)

        if session.payment_status != 'paid':
            return Response({'detail': 'Payment not completed'}, status=400)

        if session.id != fee.stripe_session_id:
            return Response({'detail': 'Session mismatch'}, status=400)

        # Mark as paid and generate a simple receipt id
        fee.status = 'Paid'
        fee.paid_date = timezone.now()
        fee.receipt_id = f"RCPT-{fee.id}-{int(timezone.now().timestamp())}"
        fee.save()

        return Response(MembershipFeeSerializer(fee, context={'request': request}).data)