from django.contrib import admin
from django.forms import ModelForm

from .models import Snippet, Language


@admin.register(Snippet)
class SnippetModelAdmin(admin.ModelAdmin):
    model = Snippet
    readonly_fields = ('created',)

    list_display = ('name', 'author', 'created', 'language')

    search_fields = ['name', 'description', 'body']


class LanguageForm(ModelForm):
    class Meta:
        fields = '__all__'

        model = Language

        help_texts = {
            'code': 'Programming language code which is supported by highlight.js',
            'style': 'Display style which is supported by highlight.js',
        }


@admin.register(Language)
class SnippetModelAdmin(admin.ModelAdmin):
    form = LanguageForm
    list_display = [
        'code',
        'name',
    ]
