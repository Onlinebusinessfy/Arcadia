from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Game, Purchase
from .serializers import GameSerializer, PurchaseSerializer


class GameViewSet(viewsets.ModelViewSet):

    serializer_class = GameSerializer

    def get_queryset(self):

        games = Game.objects.all()

        genre = self.request.query_params.get("genre")

        if genre:
            games = games.filter(
                genre__icontains=genre
            )

        return games


class PurchaseListView(APIView):
    """Devuelve los juegos que el usuario logueado ya compró (su Biblioteca)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        purchases = Purchase.objects.filter(
            user=request.user
        ).select_related("game")

        serializer = PurchaseSerializer(purchases, many=True)
        return Response(serializer.data)


class RegisterPurchaseView(APIView):
    """
    Registra la compra de uno o varios juegos para el usuario logueado.
    Se llama cuando el pago del modal se completa correctamente.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = request.data.get("items", [])

        if not items:
            return Response(
                {"error": "No hay juegos para registrar."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registrados = []

        for item in items:
            game_id = item.get("id")
            quantity = int(item.get("qty", 1))

            try:
                game = Game.objects.get(id=game_id)
            except Game.DoesNotExist:
                continue

            purchase, created = Purchase.objects.get_or_create(
                user=request.user,
                game=game,
                defaults={"quantity": quantity},
            )

            if not created:
                purchase.quantity += quantity
                purchase.save()

            registrados.append(game.title)

        return Response(
            {"message": "Compra registrada correctamente.", "games": registrados},
            status=status.HTTP_201_CREATED,
        )