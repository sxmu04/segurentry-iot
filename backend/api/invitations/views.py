from rest_framework.views import APIView
from rest_framework.response import Response

from .services.invitation_service import InvitationService
from mail_service.email_service import send_invitation_email

from api.users.services.user_service import UserService
from config.firebase.firebase_config import db



class CreateInvitationView(APIView):

    def post(self, request):
        email = request.data.get("email")
        role = request.data.get("role")

        invitation = InvitationService.create_invitation(email, role)

        send_invitation_email(email, invitation["code"])

        return Response({
            "message": "Invitación enviada",
            "code": invitation["code"]
        })
    

class ValidateInvitationView(APIView):

    def post(self, request):

        code = request.data.get("code")
        password = request.data.get("password")  # opcional futuro

        invitation = InvitationService.validate_code(code)

        if not invitation:
            return Response({
                "error": "Código inválido o ya usado"
            }, status=400)

        # crear usuario
        user = UserService.create_user_from_invitation(
            invitation["email"],
            invitation["role"]
        )

        # marcar código como usado
        db.collection("invitations").document(code).update({
            "used": True
        })

        return Response({
            "message": "Usuario activado correctamente",
            "user": user
        })