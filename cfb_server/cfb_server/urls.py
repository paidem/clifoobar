from django.contrib import admin
from django.contrib.auth import logout
from django.conf import settings
from django.urls import path, include
from django.shortcuts import redirect


def admin_logout_compat(request):
    logout(request)
    return redirect("/")

urlpatterns = [
    path('admin/logout/', admin_logout_compat),
    path('admin/', admin.site.urls),
    path('api/', include('cfb.api.urls')),
]

if settings.AUTH_MODE == 'oauth':
    urlpatterns.append(path('oidc/', include('mozilla_django_oidc.urls')))
