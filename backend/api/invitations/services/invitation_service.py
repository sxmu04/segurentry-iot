from config.firebase.firebase_config import db
from invitations.models import Invitation
from invitations.utils.code_generator import generate_invitation_code
from datetime import datetime, timedelta

class InvitationService:

    @staticmethod
    def create_invitation(email, role):
        code = generate_invitation_code()

        data = {
            "email": email,
            "role": role,
            "code": code,
            "used": False,
            "created_at": datetime.utcnow(),
        }

        db.collection("invitations").document(code).set(data)

        return data
    
    @staticmethod
    def validate_code(code):

        doc = db.collection("invitations").document(code).get()

        if not doc.exists:
            return None

        data = doc.to_dict()

        if data["used"]:
            return None

        return data