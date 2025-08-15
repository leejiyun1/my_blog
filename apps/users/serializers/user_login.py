from rest_framework import serializers
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user and user.is_active:
            data['user'] = user
            return data
        raise serializers.ValidationError('잘못된 사용자명 또는 비밀번호입니다.')