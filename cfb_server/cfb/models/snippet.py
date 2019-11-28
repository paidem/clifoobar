from django.db import models
from taggit.managers import TaggableManager
import uuid

from taggit.models import TaggedItemBase, GenericUUIDTaggedItemBase

from users.models import User


class UUIDTaggedItem(GenericUUIDTaggedItemBase, TaggedItemBase):
    # If you only inherit GenericUUIDTaggedItemBase, you need to define
    # a tag field. e.g.
    # tag = models.ForeignKey(Tag, related_name="uuid_tagged_items", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"


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
    # tags = TaggableManager(through=TaggedSnippet)
    tags = TaggableManager(through=UUIDTaggedItem)
    # TODO: Versioning

    def __str__(self):
        return self.name
