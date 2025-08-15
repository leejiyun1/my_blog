from django.urls import path
from .views.user_login import UserLogin
from .views.check_auth import CheckAuth

app_name = 'users'

urlpatterns = [
    path('login/', UserLogin, name='login'),
    path('check-auth/', CheckAuth, name='check_auth'),
]