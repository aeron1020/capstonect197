# from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from django.contrib.auth import views as auth_views
# from django.contrib import admin


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('core.urls')),

#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


#     path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
#     path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
#     path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
# ]


from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import views as auth_views
from django.contrib import admin
# 1. Import your custom view from core.serializers
from core.serializers import MyTokenObtainPairView 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),

    # 2. Change TokenObtainPairView.as_view() to MyTokenObtainPairView.as_view()
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]