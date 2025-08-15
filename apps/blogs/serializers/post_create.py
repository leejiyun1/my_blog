from rest_framework import serializers
from ..models import Post


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content']

    def create(self, validated_data):
        return Post.objects.create(**validated_data)