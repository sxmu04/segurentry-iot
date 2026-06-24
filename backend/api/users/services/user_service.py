from config.firebase.firebase_config import db
from datetime import datetime


class UserService:

    @staticmethod
    def create_user_from_invitation(email, role):

        user_data = {
            "email": email,
            "role": role,
            "active": True,
            "created_at": datetime.utcnow()
        }

        db.collection("users").document(email).set(user_data)

        return user_data