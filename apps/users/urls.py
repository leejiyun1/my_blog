from django.urls import path
from .views.user_login import UserLogin

app_name = 'users'

urlpatterns = [
    path('login/', UserLogin, name='login'),
]