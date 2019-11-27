from django.db import models

import uuid

from users.models import User


class Snippet(models.Model):
    # Service fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    created = models.DateTimeField(auto_now_add=True, blank=False)

    # Main fields
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    body = models.TextField(blank=True)
    language = models.CharField(max_length=20, null=True, blank=True)

    popularity = models.IntegerField(default=0)
    personal = models.BooleanField(default=False)

    # TODO: Tags
    # TODO: Versioning

    def __str__(self):
        return self.name
