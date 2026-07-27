from django.urls import path

from .views import (
    CheckoutSessionView,
    GamesView,
    LoginView,
    MeView,
    RegisterView,
    UpdateProfileView,
    UpdateStatusView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("checkout-session/", CheckoutSessionView.as_view(), name="checkout-session"),
    path("games/", GamesView.as_view(), name="games"),
    path("profile/update/",UpdateProfileView.as_view()),
    path("profile/status/",UpdateStatusView.as_view()),
    ]
