from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

router.register(r'users', views.UserViewSet)
router.register(r'snippets', views.SnippetViewSet, basename="Snippet")
router.register(r'tags', views.TagsViewSet)
router.register(r'languages', views.LanguageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('snippets/<uuid:uuid>/vote', views.snippets_i_used_it_view),
    path('auth/config', views.auth_config_view),
    path('auth/oauth/login', views.oauth_login_view),
    path('auth/logout', views.auth_logout_view),
]
