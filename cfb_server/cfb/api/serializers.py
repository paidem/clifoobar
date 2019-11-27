from rest_framework import serializers

from cfb.models import Snippet
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    @staticmethod
    def get_full_name(obj):
        return obj.first_name + " " + obj.last_name

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups', 'first_name',
                  'last_name', 'full_name', 'is_staff', 'is_superuser']


class UserShortSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    @staticmethod
    def get_full_name(obj):
        return obj.first_name + " " + obj.last_name

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name']
        read_only_fields = fields


class SnippetSerializer(serializers.ModelSerializer):
    author = UserShortSerializer(required=False)

    class Meta:
        model = Snippet
        fields = ['id', 'author', 'created', 'name', 'description', 'body', 'language', 'popularity', 'personal']

        read_only_fields = ['created', 'popularity', 'author']
