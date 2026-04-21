from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
# Note: Added basenames to prevent the AssertionError you had earlier
router.register('mix-designs', MixDesignViewSet, basename='mixdesign')
router.register('orders', OrderViewSet, basename='order')
router.register('quotations', QuotationViewSet, basename='quotation')
router.register('payments', PaymentViewSet, basename='payment')

urlpatterns = [

    path('me/', get_user_profile, name='user-me'),
    path('register/', RegisterView.as_view(), name='register'), # Remove 'users/'
    path('', include(router.urls)),
]