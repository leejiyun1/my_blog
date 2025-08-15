from django.urls import path
from .views.post_list import PostList
from .views.post_detail import PostDetail

app_name = 'blogs'

urlpatterns = [
    path('posts/', PostList, name='post_list'),
    path('posts/<int:pk>/', PostDetail, name='post_detail'),
]