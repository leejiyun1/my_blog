from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def CheckAuth(request):
    if request.user.is_authenticated:
        return Response({'authenticated': True}, status=status.HTTP_200_OK)
    return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)