from rest_framework import serializers
from .models import Rating
from books.models import Book
from books.serializers import BookSerializer

class RatingSerializer(serializers.ModelSerializer):
    open_library_id = serializers.CharField(write_only=True)
    title = serializers.CharField(write_only=True, required=False, allow_blank=True)
    author = serializers.CharField(write_only=True, required=False, allow_blank=True)
    cover_url = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    
    book = BookSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ('id', 'book', 'stars', 'open_library_id', 'title', 'author', 'cover_url', 'created_at', 'updated_at')
        read_only_fields = ('id', 'book', 'created_at', 'updated_at')

    def create(self, validated_data):
        user = self.context['request'].user
        open_library_id = validated_data.pop('open_library_id')
        stars = validated_data.pop('stars')
        
        # Use fallback details if Book needs to be created in local DB
        title = validated_data.pop('title', 'Untitled')
        author = validated_data.pop('author', 'Unknown Author')
        cover_url = validated_data.pop('cover_url', None)

        book, created = Book.objects.get_or_create(
            open_library_id=open_library_id,
            defaults={
                'title': title,
                'author': author,
                'cover_url': cover_url,
            }
        )

        rating, created_r = Rating.objects.update_or_create(
            user=user,
            book=book,
            defaults={'stars': stars}
        )
        return rating
