# Generated by Django 2.2.7 on 2019-11-28 07:14

from django.db import migrations, models
import django.db.models.deletion
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('taggit', '0003_taggeditem_add_unique_index'),
        ('cfb', '0005_auto_snippet_author_protect'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaggedSnippet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content_object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cfb.Snippet')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cfb_taggedsnippet_items', to='taggit.Tag')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='snippet',
            name='tags',
            field=taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='cfb.TaggedSnippet', to='taggit.Tag', verbose_name='Tags'),
        ),
    ]