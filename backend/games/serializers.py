from rest_framework import serializers
from .models import Game, Purchase


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = "__all__"


class PurchaseSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)

    class Meta:
        model = Purchase
        fields = ("id", "game", "quantity", "purchased_at")