from django.contrib import admin
from django.contrib.auth import logout
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
