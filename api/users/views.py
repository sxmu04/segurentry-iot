from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .services.user_service import UserService


@csrf_exempt
def create_user(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Método no permitido"
        }, status=405)

    try:

        data = json.loads(request.body)

        user = UserService.create_user_from_invitation(
            email=data["email"],
            role=data["role"],
            password=data["password"]
        )

        return JsonResponse({
            "success": True,
            "user": user
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)


@csrf_exempt
def list_users(request):

    if request.method != "GET":
        return JsonResponse({
            "success": False,
            "message": "Método no permitido"
        }, status=405)

    try:

        users = UserService.get_all_users()

        return JsonResponse({
            "success": True,
            "users": users
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)


@csrf_exempt
def update_user(request, uid):

    if request.method != "PUT":
        return JsonResponse({
            "success": False,
            "message": "Método no permitido"
        }, status=405)

    try:

        data = json.loads(request.body)

        user = UserService.update_user(uid, data)

        return JsonResponse({
            "success": True,
            "message": "Usuario actualizado correctamente",
            "user": user
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)


@csrf_exempt
def delete_user(request, uid):

    if request.method != "DELETE":
        return JsonResponse({
            "success": False,
            "message": "Método no permitido"
        }, status=405)

    try:

        UserService.delete_user(uid)

        return JsonResponse({
            "success": True,
            "message": "Usuario eliminado correctamente"
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=400)