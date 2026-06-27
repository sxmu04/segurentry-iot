from django.urls import path

from django.http import JsonResponse

from .firebase_test import test_connection

from .views import UserListCreateView

def firebase_status(request):

    try:

        collections = test_connection()

        return JsonResponse({
            "success": True,
            "collections": collections
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "error": str(e)
        })


urlpatterns = [

    path(
        "firebase-status/",
        firebase_status
    )
    path('users/', UserListCreateView.as_view()),
]