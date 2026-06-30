from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Información de Arcadia", {
            "fields": (
                "profile_picture",
                "bio",
                "status",
                "created_at",
            )
        }),
    )

    readonly_fields = ("created_at",)
