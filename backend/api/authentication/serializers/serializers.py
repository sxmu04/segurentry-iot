from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        
        token['rol'] = user.role.name if user.role else None
        token['email'] = user.email
        

        return token