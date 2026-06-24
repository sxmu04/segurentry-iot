from django.http import JsonResponse
from .models import UserService
import json


def create_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = UserService.create_user(data)

        return JsonResponse({
            "success": True,
            "user": user
        })


def list_users(request):
    users = UserService.get_all_users()

    return JsonResponse({
        "success": True,
        "users": users
    })