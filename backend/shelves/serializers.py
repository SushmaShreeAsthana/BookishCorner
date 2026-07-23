from rest_framework import serializers
from .models import Shelf, ShelfBook
from books.serializers import BookSerializer

class ShelfSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()
    covers = serializers.SerializerMethodField()
    has_book = serializers.SerializerMethodField()

    class Meta:
        model = Shelf
        fields = ('id', 'name', 'is_default', 'created_at', 'book_count', 'covers', 'has_book')
        read_only_fields = ('id', 'is_default', 'created_at')

    def get_book_count(self, obj):
        return obj.shelf_books.count()

    def get_covers(self, obj):
        # Fetch the first 4 book covers for shelf thumbnail displays
        books_qs = obj.shelf_books.order_by('-added_at')[:4]
        return [sb.book.cover_url for sb in books_qs if sb.book.cover_url]

    def get_has_book(self, obj):
        request = self.context.get('request')
        if request:
            open_library_id = request.query_params.get('open_library_id')
            if open_library_id:
                return obj.shelf_books.filter(book__open_library_id=open_library_id).exists()
        return False

class ShelfBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = ShelfBook
        fields = ('id', 'book', 'added_at', 'status_notes')
