from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from manager.models import member, Save, Borrowed
from manager.serializers import SaveSerializer, MemberSerializer


class MemberLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            m = member.objects.get(Email=email)
        except member.DoesNotExist:
            return Response({'detail': 'Email does not match'}, status=400)
        if m.Password != password:
            return Response({'detail': 'Password does not match'}, status=400)
        return Response(MemberSerializer(m).data)


'''  index.html  '''

class MemberBooksView(APIView):         
    permission_classes = [AllowAny]
    def get(self, request):
        q = request.query_params.get('q')
        qs = Save.objects.all()
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(Author__icontains=q) | Q(Category__icontains=q))
        return Response(SaveSerializer(qs, many=True, context={'request': request}).data)

'''index.html -> Borrow button (getreq)'''

class MemberBorrowView(APIView):       
    permission_classes = [AllowAny]
    def post(self, request):
        member_id = request.data.get('member_id')
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
    permission_classes = [AllowAny]
    def get(self, request):
        member_id = request.query_params.get('member_id')
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
            })
        return Response(data)


'''    Cancel button     '''

class MemberCancelRequestView(APIView):    
    permission_classes = [AllowAny]
    def delete(self, request, book_id):
        member_id = request.query_params.get('member_id')
        Borrowed.objects.filter(i_id=member_id, book_id=book_id).delete()
        return Response({'detail': 'Request cancelled'})


'''   Return button  '''

class MemberReturnRequestView(APIView):    
    permission_classes = [AllowAny]
    def post(self, request, book_id):
        member_id = request.data.get('member_id')
        try:
            b = Borrowed.objects.get(i_id=member_id, book_id=book_id)
        except Borrowed.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        b.Status = 'Returned Request'
        b.save()
        return Response({'detail': 'Return request submitted'})


'''    Profile view   '''

class MemberProfileView(APIView):      
    permission_classes = [AllowAny]
    def get(self, request):
        member_id = request.query_params.get('member_id')
        try:
            m = member.objects.get(m_id=member_id)
        except member.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        return Response(MemberSerializer(m).data)


'''    Change Password form   '''


class MemberChangePasswordView(APIView):    
    permission_classes = [AllowAny]
    def post(self, request):
        member_id = request.data.get('member_id')
        old, new, confirm = request.data.get('old_password'), request.data.get('new_password'), request.data.get('confirm_password')
        try:
            m = member.objects.get(m_id=member_id)
        except member.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        if m.Password != old:
            return Response({'detail': 'Old Password is not correct'}, status=400)
        if new != confirm:
            return Response({'detail': 'Confirm password does not match'}, status=400)
        if new == old:
            return Response({'detail': 'Password should not match your previous!'}, status=400)
        m.Password = new
        m.save()
        return Response({'detail': 'Password changed successfully'})