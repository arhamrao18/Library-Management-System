from rest_framework.routers import DefaultRouter
from .api_views import BookViewSet, MemberViewSet, BorrowedViewSet  

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'borrowed', BorrowedViewSet, basename='borrowed')

urlpatterns = router.urls