from django.urls import path
from .views import register_access_view, get_access_logs_view

urlpatterns = [
    path('register/', register_access_view),
    path('', get_access_logs_view),
]