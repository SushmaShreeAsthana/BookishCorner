from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from books.models import Book

class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} rated {self.book.title} - {self.stars} stars"
