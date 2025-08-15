from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import Post
from ..serializers.post_detail import PostDetailSerializer

@api_view(['GET'])
def PostDetail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    serializer = PostDetailSerializer(post)
    return Response(serializer.data, status=status.HTTP_200_OK)