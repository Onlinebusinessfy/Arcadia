from rest_framework.viewsets import ModelViewSet
from .models import Game
from .serializers import GameSerializer
from rest_framework import viewsets


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