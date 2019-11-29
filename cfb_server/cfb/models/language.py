from django.db import models


class Language(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=20, blank=True, unique=True)

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.code

        super().save(*args, **kwargs)
