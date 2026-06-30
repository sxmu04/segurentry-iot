
from django.contrib import admin
from django.urls import path
from django.urls import include


urlpatterns = [
    path('admin/', admin.site.urls),

    #Modulos
    path('api/users/', include('api.users.urls')),
    path('api/roles/', include('api.roles.urls')),
    #path('api/dashboard/', include('api.dashboard.urls')),
    path('api/access/', include('api.access.urls')),
    path('api/auth/', include('api.authentication.urls')),
    path('api/invitations/', include('api.invitations.urls')),
]