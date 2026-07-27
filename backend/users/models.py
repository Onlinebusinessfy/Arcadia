from django.contrib.auth.models import AbstractUser
from django.db import models


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

    username_last_changed = models.DateTimeField(
        auto_now_add=True
    )

    has_changed_username = models.BooleanField(
        default=False
    )

    def save(self, *args, **kwargs):
        if self.profile_picture:
            self.profile_picture.name = f"pfp_{self.id}.{self.profile_picture.name.split('.')[-1]}"
        
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.username
