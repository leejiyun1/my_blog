from django.urls import path

from .views.comment_create import CommentCreate
from .views.post_create import PostCreate
from .views.post_list import PostList
from .views.post_detail import PostDetail

app_name = 'blogs'

urlpatterns = [
    path('posts/', PostList, name='post_list'),
    path('posts/<int:pk>/', PostDetail, name='post_detail'),
    path('posts/create/', PostCreate, name='post_create'),
    # path('posts/<int:pk>/comments/', CommentList, name='comment_list'),
    path('comments/', CommentCreate, name='comment_create'),

]