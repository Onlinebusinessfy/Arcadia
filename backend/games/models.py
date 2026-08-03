from django.conf import settings
from django.db import models


class Game(models.Model):

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    genre = models.CharField(
        max_length=100
    )

    developer = models.CharField(
        max_length=100
    )

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    discount = models.IntegerField(
        default=0
    )

    image = models.URLField()

    rating = models.FloatField(
        default=0
    )

    platforms = models.JSONField(
        default=list
    )

    release_date = models.DateField(
        null=True,
        blank=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return self.title


class Purchase(models.Model):
    """Relación entre un usuario y un juego que compró (para la Biblioteca)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="purchases",
    )

    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="purchases",
    )

    quantity = models.PositiveIntegerField(default=1)

    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "game")

    def __str__(self):
        return f"{self.user} -> {self.game} (x{self.quantity})"