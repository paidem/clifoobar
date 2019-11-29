# Generated by Django 2.2.7 on 2019-11-29 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cfb', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True)),
                ('name', models.CharField(blank=True, max_length=20, unique=True)),
            ],
        ),
    ]
