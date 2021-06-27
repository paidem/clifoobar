import uuid

from django.db.models import Q, F
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from taggit.models import Tag

from cfb.models import Snippet, Language
from .serializers import UserSerializer, SnippetSerializer, TagSerializer, LanguageSerializer
from users.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def dispatch(self, request, *args, **kwargs):
        if kwargs.get('pk') == 'current' and request.user:
            kwargs['pk'] = request.user.pk
        return super(UserViewSet, self).dispatch(request, *args, **kwargs)


# noinspection PyUnusedLocal
class SnippetAccessPermission(BaseException):
    @staticmethod
    def has_permission(request, view):
        # Allow read to any users
        if request.method in ["GET", 'HEAD', 'OPTIONS']:
            return True

        # Allow creating new snippets and modifying only to logged in users
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return request.user.is_authenticated

    @staticmethod
    def has_object_permission(request, view, obj):
        # Allow read to any users
        if request.method in ["GET", 'HEAD', 'OPTIONS']:
            return True

        # Allow creating only to  logged in users
        if request.method in ['POST']:
            return request.user.is_authenticated

        # Allow modifying only to authors or superusers
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return request.user.is_superuser or obj.author == request.user


class SnippetViewSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class SnippetViewSet(viewsets.ModelViewSet):
    serializer_class = SnippetSerializer
    permission_classes = [SnippetAccessPermission]
    pagination_class = SnippetViewSetPagination

    # Override perform_create to set author
    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
        )

    def get_queryset(self):
        queryset = Snippet.objects.all()

        q = self.request.query_params.get('q', None)

        tags = set()
        uuidMatched = False

        if q is not None:
            terms = q.split(' ')
            if len(terms) == 1:
                try:
                    uuid_obj = uuid.UUID(terms[0])
                    uuidMatched = True
                    queryset = self.add_id_filter(queryset, uuid_obj)
                except ValueError:
                    pass

            if not uuidMatched:
                for term in terms:
                    if term and term[0] == '#':
                        tags.add(term[1:])
                    else:
                        queryset = self.add_contains_filter(queryset, term)

        if len(tags) > 0:
            queryset = queryset.filter(tags__name__in=tags).distinct()

        # Add ordering
        order_by = self.request.query_params.get('order_by', None)
        if order_by is not None:
            queryset = queryset.order_by(order_by)
        else:
            queryset = queryset.order_by('created')

        if order_by == '-personal':
            queryset = queryset.filter(Q(personal=True))

        # Show only non personal and those where user is author
        if self.request.user.is_authenticated:
            queryset = queryset.filter(Q(personal=False) | Q(author=self.request.user))
        else:
            queryset = queryset.filter(Q(personal=False))

        return queryset

    @classmethod
    def add_contains_filter(cls, queryset, term):
        return queryset.filter(Q(name__contains=term) | Q(description__contains=term) | Q(body__contains=term))

    @classmethod
    def add_id_filter(cls, queryset, id):
        return queryset.filter(id=id)


@api_view(['POST'])
def snippets_i_used_it_view(request, uuid):
    try:
        snippet = Snippet.objects.get(pk=uuid)
        snippet.popularity = F('popularity') + 1
        snippet.save()
        return Response("Thank you! Your vote matters to us!", status=status.HTTP_202_ACCEPTED)

    except Snippet.DoesNotExist:
        raise NotFound(detail="Ticket not found")


class TagsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()
