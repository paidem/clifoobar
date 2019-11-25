from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError, ParseError
from rest_framework.permissions import IsAuthenticated, BasePermission, IsAdminUser

from cfb.models import Snippet
from .serializers import UserSerializer, SnippetSerializer
from users.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def dispatch(self, request, *args, **kwargs):
        if kwargs.get('pk') == 'current' and request.user:
            kwargs['pk'] = request.user.pk
        return super(UserViewSet, self).dispatch(request, *args, **kwargs)


class SnippetAccessPermission(BaseException):
    def has_permission(self, request, view):
        # Allow read to any users
        if request.method in ["GET", 'HEAD', 'OPTIONS']:
            return True

        # Allow creating new snippets and modifying only to logged in users
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read to any users
        if request.method in ["GET", 'HEAD', 'OPTIONS']:
            return True

        # Allow creating only to  logged in users
        if request.method in ['POST']:
            return request.user.is_authenticated

        # Allow modifying only to authors or superusers
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return request.user.is_superuser or obj.author == request.user


class SnippetViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    permission_classes = [SnippetAccessPermission]

    # Override perform_create to set author
    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
        )
