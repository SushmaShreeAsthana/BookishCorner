from django.db import models
from django.conf import settings
from books.models import Book

class Shelf(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shelves')
    name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'name')
        verbose_name_plural = 'Shelves'

    def __str__(self):
        return f"{self.user.username}'s {self.name}"

class ShelfBook(models.Model):
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE, related_name='shelf_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='shelf_assignments')
    added_at = models.DateTimeField(auto_now_add=True)
    status_notes = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('shelf', 'book')

    def __str__(self):
        return f"{self.book.title} on {self.shelf.name}"
