from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from firebase_admin import auth
from rest_framework_simplejwt.tokens import RefreshToken
from config.firebase_config import db

import traceback

from .firebase_auth import verify_firebase_token
from config.firebase_config import db

from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GoogleLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        id_token = request.data.get("id_token")

        print("=" * 60)
        print("BODY COMPLETO:")
        print(request.data)
        print("=" * 60)

        print("TOKEN:")
        print(id_token)

        if id_token:
            print("LONGITUD:", len(id_token))
            print("SEGMENTOS:", len(id_token.split(".")))

        if not id_token:
            return Response(
                {
                    "success": False,
                    "message": "Token requerido"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            print("TOKEN RECIBIDO:", id_token[:50])
            print("VERIFICANDO TOKEN...")

            user_data = verify_firebase_token(id_token)

            print("USUARIO:", user_data)

            email = user_data.get("email")

            user_ref = db.collection("users").document(email)

            if not user_ref.get().exists:

                user_ref.set({
                "uid": user_data["uid"],
                "email": email,
                "name": user_data.get("name"),
                "provider": "google",
                "role": "visitor",
                "active": True
            })

            user = user_ref.get().to_dict()

            return Response(
                {
                    "success": True,
                    "message": "Login exitoso",
                    "user": user
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print("========== ERROR GOOGLE LOGIN ==========")
            print(str(e))
            traceback.print_exc()

            return Response(
                {
                    "success": False,
                    "message": str(e)
                },
            status=status.HTTP_400_BAD_REQUEST
            )
class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response({
                "success": False,
                "message": "Email requerido"
            }, status=400)

        try:

            firebase_user = auth.get_user_by_email(email)

            # Buscar por EMAIL
            user_doc = db.collection("users").document(email).get()

            if not user_doc.exists:
                return Response({
                    "success": False,
                    "message": "Usuario no encontrado"
                }, status=404)

            user_data = user_doc.to_dict()

            refresh = RefreshToken()

            refresh["uid"] = firebase_user.uid
            refresh["email"] = email
            refresh["role"] = user_data.get("role", "")

            return Response({
                "success": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            })

        except Exception as e:

            return Response({
                "success": False,
                "message": str(e)
            }, status=400)

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:

            return Response({
                "success": False,
                "message": "Email requerido"
            }, status=400)

        try:

            firebase_user = auth.get_user_by_email(email)

            user_doc = db.collection("users").document(
                firebase_user.uid
            ).get()

            if not user_doc.exists:

                return Response({
                    "success": False,
                    "message": "Usuario no encontrado"
                }, status=404)

            user_data = user_doc.to_dict()

            refresh = RefreshToken()

            refresh["uid"] = firebase_user.uid
            refresh["email"] = email
            refresh["role"] = user_data["role"]

            return Response({
                "success": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            })

        except Exception as e:

            return Response({
                "success": False,
                "message": str(e)
            }, status=400)
        
class CheckProviderView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response({
                "success": False,
                "message": "Email requerido"
            }, status=400)

        docs = db.collection("users") \
                 .where("email", "==", email) \
                 .limit(1) \
                 .stream()

        docs = list(docs)

        if len(docs) == 0:

            return Response({
                "success": True,
                "exists": False,
                "provider": None
            })

        user = docs[0].to_dict()

        return Response({

            "success": True,
            "exists": True,
            "provider": user.get("provider", "password")

        })