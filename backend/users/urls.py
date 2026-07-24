from django.urls import path

from .views import CheckoutSessionView, LoginView, MeView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("checkout-session/", CheckoutSessionView.as_view(), name="checkout-session"),
]
