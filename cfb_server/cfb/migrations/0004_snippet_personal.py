# Generated by Django 2.2.7 on 2019-11-27 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cfb', '0003_snippet_popularity'),
    ]

    operations = [
        migrations.AddField(
            model_name='snippet',
            name='personal',
            field=models.BooleanField(default=False),
        ),
    ]
