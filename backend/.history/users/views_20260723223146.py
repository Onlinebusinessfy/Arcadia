import requests
import environ

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.conf import settings

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

env = environ.Env()


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Usuario registrado correctamente.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            data = serializer.validated_data
            user = data["user"]

            return Response(
                {
                    "access": data["access"],
                    "refresh": data["refresh"],
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "status": user.status,
                    }
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class GamesView(APIView):

    def get(self, request):

        url = "https://api.rawg.io/api/games"

        params = {
            "key": env("RAWG_API_KEY"),
            "page_size": 20
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            return Response(
                {
                    "error": "No fue posible obtener los videojuegos desde RAWG."
                },
                status=response.status_code
            )

        return Response(response.json())