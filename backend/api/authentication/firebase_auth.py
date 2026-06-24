from firebase_admin import auth as firebase_auth
from users.models import User
from roles.models import Role

def verify_firebase_token(id_token):

    decoded = firebase_auth.verify_id_token(id_token)

    email = decoded.get('email')

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": email.split("@")[0],
        }
    )

    # asignar rol por defecto si es nuevo
    if created:
        user.role = Role.objects.get(name="user")
        user.save()

    return user