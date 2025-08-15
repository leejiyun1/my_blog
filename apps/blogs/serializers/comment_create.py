from apps.blogs.models import Comment
from rest_framework import serializers

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['post', 'author', 'content']

    def create(self, validated_data):
        """
        Create a new comment instance.
        """
        return Comment.objects.create(**validated_data)