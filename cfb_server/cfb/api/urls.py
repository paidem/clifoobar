from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

router.register(r'users', views.UserViewSet)
router.register(r'snippets', views.SnippetViewSet, basename="Snippet")
router.register(r'tags', views.TagsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('snippets/<uuid:uuid>/vote', views.snippets_i_used_it_view),
]
