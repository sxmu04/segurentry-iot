from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import register_access, get_access_logs

@api_view(['POST'])
def register_access_view(request):
    return Response(register_access(request.data))


@api_view(['GET'])
def get_access_logs_view(request):
    return Response(get_access_logs())