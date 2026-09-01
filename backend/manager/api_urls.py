from django.urls import path
from rest_framework.routers import DefaultRouter
from .api_views import BookViewSet, MemberViewSet, BorrowedViewSet, GenerateFeesView, MembershipFeeViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'borrowed', BorrowedViewSet, basename='borrowed')
router.register(r'fees', MembershipFeeViewSet, basename='fee')

urlpatterns = router.urls + [
    path('fees/generate/', GenerateFeesView.as_view()),
]