from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Post
from ..serializers.post_list import PostListSerializer

@api_view(['GET'])
def PostList(request):
    posts = Post.objects.all()
    serializer = PostListSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)