from django.db import models

class Book(models.Model):
    open_library_id = models.CharField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    cover_url = models.URLField(max_length=1000, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author}"
