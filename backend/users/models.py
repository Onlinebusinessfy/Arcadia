from django.contrib.auth.models import AbstractUser
from django.db import models

from django.utils import timezone

class CustomUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    bio = models.TextField(blank=True)

    STATUS_CHOICES = [
        ("online", "Online"),
        ("away", "Ausente"),
        ("busy", "Ocupado"),
        ("invisible", "Invisible"),
    ]


    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="online"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # Nuevo
    username_last_changed = models.DateTimeField(
        auto_now_add=True
    )
    has_changed_username = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.username
