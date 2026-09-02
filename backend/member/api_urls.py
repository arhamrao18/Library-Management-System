from django.urls import path
from . import api_views

urlpatterns = [
    path('login/', api_views.MemberLoginView.as_view(), name='member_api_login'),
    path('books/', api_views.MemberBooksView.as_view(), name='member_api_books'),
    path('borrow/', api_views.MemberBorrowView.as_view(), name='member_api_borrow'),
    path('requests/', api_views.MemberRequestsView.as_view(), name='member_api_requests'),
    path('requests/cancel/<int:book_id>/', api_views.MemberCancelRequestView.as_view(), name='member_api_cancel'),
    path('requests/return/<int:book_id>/', api_views.MemberReturnRequestView.as_view(), name='member_api_return'),
    path('profile/', api_views.MemberProfileView.as_view(), name='member_api_profile'),
    path('change-password/', api_views.MemberChangePasswordView.as_view(), name='member_api_change_password'),
    path('fees/', api_views.MemberFeesView.as_view(), name='member_api_fees'),
    path('notifications/unseen-count/', api_views.MemberNotificationCountView.as_view(), name='member_api_unseen_count'),
     path('fees/checkout/', api_views.CreateCheckoutSessionView.as_view(), name='member_api_checkout'),
    path('fees/confirm-payment/', api_views.ConfirmPaymentView.as_view(), name='member_api_confirm_payment'),
]