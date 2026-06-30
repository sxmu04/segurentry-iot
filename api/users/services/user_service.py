from config.firebase_config import db
from firebase_admin import auth
from datetime import datetime


class UserService:

    @staticmethod
    def create_user_from_invitation(email, role, password):

        try:
            auth.get_user_by_email(email)
            raise Exception("El usuario ya existe")

        except auth.UserNotFoundError:
            pass

        firebase_user = auth.create_user(
            email=email,
            password=password,
            email_verified=True
        )

        auth.set_custom_user_claims(
            firebase_user.uid,
            {
                "role": role
            }
        )

        user_data = {
            "uid": firebase_user.uid,
            "email": email,
            "role": role,
            "active": True,
            "created_at": datetime.utcnow().isoformat()
        }

        db.collection("users").document(firebase_user.uid).set(user_data)

        return user_data

    @staticmethod
    def get_all_users():

        users = []

        docs = db.collection("users").stream()

        for doc in docs:

            user = doc.to_dict()

            users.append(user)

        return users

    @staticmethod
    def update_user(uid, data):

        # Obtener usuario actual
        user_ref = db.collection("users").document(uid)

        if not user_ref.get().exists:
            raise Exception("Usuario no encontrado")

        # Actualizar Firebase Authentication
        update_data = {}

        if "email" in data:
            update_data["email"] = data["email"]

        if "password" in data:
            update_data["password"] = data["password"]

        if update_data:
            auth.update_user(uid, **update_data)

        # Actualizar rol
        if "role" in data:

            auth.set_custom_user_claims(
                uid,
                {
                    "role": data["role"]
                }
            )

        # Actualizar Firestore
        firestore_data = {}

        if "email" in data:
            firestore_data["email"] = data["email"]

        if "role" in data:
            firestore_data["role"] = data["role"]

        if "active" in data:
            firestore_data["active"] = data["active"]

        if "name" in data:
            firestore_data["name"] = data["name"]

        if firestore_data:
            user_ref.update(firestore_data)

        return user_ref.get().to_dict()

    @staticmethod
    def delete_user(uid):

        # Eliminar de Firebase Authentication
        auth.delete_user(uid)

        # Eliminar de Firestore
        db.collection("users").document(uid).delete()

        return True