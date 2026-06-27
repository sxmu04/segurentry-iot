from django.urls import path
from .views import UserListCreateView

from .views import (
    create_user,
    list_users,
    update_user,
    delete_user
)

urlpatterns = [

    path("create/", create_user),

    path("list/", list_users),

    path("update/<str:uid>/", update_user),

    path("delete/<str:uid>/", delete_user),
    path('', UserListCreateView.as_view(), name='users'),

]