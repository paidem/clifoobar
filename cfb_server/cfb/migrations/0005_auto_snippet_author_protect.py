# Generated by Django 2.2.7 on 2019-11-27 17:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cfb', '0004_snippet_personal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='snippet',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]