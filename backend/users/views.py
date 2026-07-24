import os

import stripe
from django.conf import settings
import requests
import environ

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


from .serializers import LoginSerializer, RegisterSerializer, UserSerializer, UpdateProfileSerializer

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None) or os.getenv("STRIPE_SECRET_KEY")
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


class CheckoutSessionView(APIView):
    def post(self, request):
        items = request.data.get("items", [])

        if not items:
            return Response({"error": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

        line_items = []
        for item in items:
            price_value = float(str(item.get("price", "$0")).replace("$", ""))
            quantity = int(item.get("qty", 1))
            line_items.append(
                {
                    "price_data": {
                        "currency": "mxn",
                        "product_data": {
                            "name": item.get("title", "Juego Arcadia"),
                        },
                        "unit_amount": int(price_value * 100),
                    },
                    "quantity": quantity,
                }
            )

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=line_items,
                mode="payment",
                success_url=request.data.get("successUrl", settings.CHECKOUT_SUCCESS_URL),
                cancel_url=request.data.get("cancelUrl", settings.CHECKOUT_CANCEL_URL),
            )
        except Exception as exc:  # pragma: no cover - defensive branch
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"id": session.id, "url": session.url})
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

class UpdateProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response(UserSerializer(user).data)

        print(serializer.errors)   # <-- Agrega esto

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class UpdateStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        status_value = request.data.get("status")

        allowed = [
            "online",
            "invisible",
            "away",
            "busy"
        ]

        if status_value not in allowed:
            return Response(
                {
                    "error": "Estado inválido."
                },
                status=400
            )


        request.user.status = status_value
        request.user.save()


        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )