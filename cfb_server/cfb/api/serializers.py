import json

from rest_framework import serializers
from taggit.models import Tag
from taggit.serializers import (TagListSerializerField,
                                TaggitSerializer)

from cfb.models import Snippet, Language
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


class SnippetSerializer(TaggitSerializer, serializers.ModelSerializer):
    author = UserShortSerializer(required=False)
    tags = TagListSerializerField()

    class Meta:
        model = Snippet
        fields = ['id', 'author', 'created', 'name', 'description',
                  'body', 'language', 'popularity', 'personal', 'tags']

        read_only_fields = ['created', 'popularity', 'author']

    @classmethod
    def _normalize_tags(cls, raw_value):
        def to_list(value):
            if value is None:
                return []
            if isinstance(value, list):
                return value
            if isinstance(value, (set, tuple)):
                return list(value)
            if isinstance(value, str):
                value = value.strip()
                if not value:
                    return []
                try:
                    parsed = json.loads(value)
                except json.JSONDecodeError:
                    return [item.strip() for item in value.split(",") if item.strip()]
                return to_list(parsed)
            if isinstance(value, dict):
                return [value]
            return [value]

        normalized = []
        for item in to_list(raw_value):
            if isinstance(item, dict):
                item = item.get("value", "")

            if isinstance(item, (list, tuple, set)):
                normalized.extend(cls._normalize_tags(item))
                continue

            if isinstance(item, str):
                candidate = item.strip()
                if not candidate:
                    continue
                if candidate.startswith("[") and candidate.endswith("]"):
                    try:
                        normalized.extend(cls._normalize_tags(json.loads(candidate)))
                        continue
                    except json.JSONDecodeError:
                        pass
                normalized.append(candidate)
                continue

            normalized.append(str(item))

        # Preserve order while dropping duplicates
        return list(dict.fromkeys(normalized))

    def validate_tags(self, value):
        normalized = self._normalize_tags(value)
        if not isinstance(normalized, list):
            raise serializers.ValidationError("Tags must be a list.")
        return normalized


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['code', 'name']
