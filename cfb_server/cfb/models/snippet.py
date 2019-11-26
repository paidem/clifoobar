from django.db import models

import uuid

from users.models import User


class Snippet(models.Model):
    # Service fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    created = models.DateTimeField(auto_now_add=True, blank=False)

    # Main fields
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    body = models.TextField(blank=True)
    language = models.CharField(max_length=20, null=True, blank=True)

    # TODO: Tags
    # TODO: Language selection
    # TODO: Versioning

    def __str__(self):
        return self.name
