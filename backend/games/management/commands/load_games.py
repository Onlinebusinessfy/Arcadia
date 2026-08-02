import json

from django.core.management.base import BaseCommand
from games.models import Game


class Command(BaseCommand):

    help = "Carga juegos iniciales"


    def handle(self, *args, **kwargs):

        with open(
            "games/data/games.json",
            encoding="utf-8"
        ) as file:

            games = json.load(file)


        for game in games:

            Game.objects.create(
                **game
            )


        self.stdout.write(
            self.style.SUCCESS(
                "Juegos cargados correctamente"
            )
        )