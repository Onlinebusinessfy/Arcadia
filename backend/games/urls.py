from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import GameViewSet, PurchaseListView, RegisterPurchaseView


router = DefaultRouter()

router.register(
    "",
    GameViewSet,
    basename="games"
)


urlpatterns = [
    path("purchases/", PurchaseListView.as_view(), name="purchases-list"),
    path("purchases/register/", RegisterPurchaseView.as_view(), name="purchases-register"),
] + router.urls