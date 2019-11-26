from django.contrib import admin
from .models import Snippet


@admin.register(Snippet)
class SnippetModelAdmin(admin.ModelAdmin):
    model = Snippet
    readonly_fields = ('created',)

    list_display = ('name', 'author', 'created', 'language')

    search_fields = ['name', 'description', 'body']
