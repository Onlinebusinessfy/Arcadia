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
        ("away", "Away"),
        ("busy", "Busy"),
        ("offline", "Offline"),
    ]

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="offline"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # Nuevo
    username_last_changed = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.username
