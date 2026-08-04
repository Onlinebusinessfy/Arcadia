from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from datetime import timedelta
from django.utils import timezone

from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password",
            "confirm_password"
        ]

    def validate_username(self, value):
        if CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Este nombre de usuario ya está en uso."
            )
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Este correo electrónico ya está registrado."
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Las contraseñas no coinciden."
            })
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        return CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError(
                "Nombre de usuario o contraseña incorrectos."
            )

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


# serializers.py
class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "bio",
            "profile_picture",
            "status",
            "created_at",
            "username_last_changed",
        ]

    def get_profile_picture(self, obj):
        """Devuelve la URL completa de la imagen del perfil"""
        if obj.profile_picture:
            # ✅ Si es un objeto ImageFieldFile, usar .url
            if hasattr(obj.profile_picture, 'url'):
                return obj.profile_picture.url
            # ✅ Si es un string, convertirlo
            picture = str(obj.profile_picture)
            if picture.startswith('http'):
                return picture
            if picture.startswith('/media/'):
                return picture
            if picture.startswith('media/'):
                return f"/{picture}"
            if picture.startswith('profiles/'):
                return f"/media/{picture}"
            return f"/media/profiles/{picture}"
        return None


class UpdateProfileSerializer(serializers.ModelSerializer):
    # ✅ Este campo SOLO se usa para la respuesta, no para escritura
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            "username",
            "bio",
            "status",
            "profile_picture",  # ✅ Incluido para la respuesta
        ]
        # ✅ IMPORTANTE: profile_picture es solo lectura
        read_only_fields = ['profile_picture']

    def get_profile_picture(self, obj):
        """Devuelve la URL correcta de la imagen del perfil"""
        if obj.profile_picture:
            # ✅ Si es un objeto ImageFieldFile, usar .url
            if hasattr(obj.profile_picture, 'url'):
                return obj.profile_picture.url
            # ✅ Si es un string, convertirlo
            picture = str(obj.profile_picture)
            if picture.startswith('http'):
                return picture
            if picture.startswith('/media/'):
                return picture
            if picture.startswith('media/'):
                return f"/{picture}"
            if picture.startswith('profiles/'):
                return f"/media/{picture}"
            return f"/media/profiles/{picture}"
        return None

    def validate_username(self, value):
        user = self.instance
        if value != user.username:
            if CustomUser.objects.filter(
                username__iexact=value
            ).exclude(id=user.id).exists():
                raise serializers.ValidationError(
                    "Ese nombre ya está en uso."
                )
            
            if user.username_last_changed:
                next_change = user.username_last_changed + timedelta(days=30)
                if timezone.now() < next_change:
                    raise serializers.ValidationError(
                        f"Podrás cambiar tu nombre nuevamente el {next_change.date()}."
                    )
        return value
    
    def update(self, instance, validated_data):
        # ✅ Actualizar username si está presente
        if 'username' in validated_data:
            instance.username = validated_data['username']
            instance.username_last_changed = timezone.now()
        
        # ✅ Actualizar bio si está presente
        if 'bio' in validated_data:
            instance.bio = validated_data['bio']
        
        # ✅ Actualizar status si está presente
        if 'status' in validated_data:
            instance.status = validated_data['status']
        
        # ✅ NOTA: profile_picture NO se actualiza aquí porque es read_only
        # La imagen se maneja en la vista con request.FILES
        
        instance.save()
        return instance