from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .services.invitation_service import InvitationService
from mail_service.email_service import send_invitation_email

from api.users.services.user_service import UserService
from config.firebase_config import db


class CreateInvitationView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")
        role = request.data.get("role")

        if not email or not role:
            return Response({
                "success": False,
                "message": "Email y rol son obligatorios"
            }, status=400)

        invitation = InvitationService.create_invitation(
            email=email,
            role=role
        )

        try:
            send_invitation_email(
                email,
                invitation["code"]
            )
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Error enviando correo: {str(e)}"
            }, status=500)

        return Response({
            "success": True,
            "message": "Invitación enviada correctamente",
            "code": invitation["code"]
        })


class ValidateInvitationView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        code = request.data.get("code")
        password = request.data.get("password")

        if not code:
            return Response({
                "success": False,
                "message": "Debe enviar un código"
            }, status=400)

        if not password:
            return Response({
                "success": False,
                "message": "Debe enviar una contraseña"
            }, status=400)

        invitation = InvitationService.validate_code(code)

        if not invitation:
            return Response({
                "success": False,
                "message": "Código inválido o expirado"
            }, status=400)

        try:

            user = UserService.create_user_from_invitation(
                email=invitation["email"],
                role=invitation["role"],
                password=password
            )

            db.collection("invitations").document(code).update({
                "used": True
            })

            return Response({
                "success": True,
                "message": "Usuario activado correctamente",
                "user": user
            })

        except Exception as e:

            return Response({
                "success": False,
                "message": str(e)
            }, status=500)