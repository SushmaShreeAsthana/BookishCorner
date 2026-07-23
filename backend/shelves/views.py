from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Shelf, ShelfBook
from .serializers import ShelfSerializer, ShelfBookSerializer
from books.models import Book

class ShelfViewSet(viewsets.ModelViewSet):
    serializer_class = ShelfSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only view/modify their own shelves
        return Shelf.objects.filter(user=self.request.user).order_by('is_default', 'name')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        # Prevent users from deleting their default shelves
        shelf = self.get_object()
        if shelf.is_default:
            return Response(
                {'error': 'Default shelves (Currently Reading, Want to Read, Completed) cannot be deleted.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['get', 'post'], url_path='books')
    def books_management(self, request, pk=None):
        shelf = self.get_object()

        if request.method == 'GET':
            shelf_books = ShelfBook.objects.filter(shelf=shelf).order_by('-added_at')
            serializer = ShelfBookSerializer(shelf_books, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            open_library_id = request.data.get('open_library_id')
            if not open_library_id:
                return Response({'error': 'open_library_id is required'}, status=status.HTTP_400_BAD_REQUEST)

            title = request.data.get('title', 'Untitled')
            author = request.data.get('author', 'Unknown Author')
            cover_url = request.data.get('cover_url')
            description = request.data.get('description')
            status_notes = request.data.get('status_notes', '')

            # Get or create the book locally
            book, created = Book.objects.get_or_create(
                open_library_id=open_library_id,
                defaults={
                    'title': title,
                    'author': author,
                    'cover_url': cover_url,
                    'description': description
                }
            )

            # Check if this book is already on the shelf
            shelf_book, created_sb = ShelfBook.objects.get_or_create(
                shelf=shelf,
                book=book,
                defaults={'status_notes': status_notes}
            )

            if not created_sb:
                # If already exists, optionally update notes
                if status_notes:
                    shelf_book.status_notes = status_notes
                    shelf_book.save()

            # Optional detail response
            serializer = ShelfBookSerializer(shelf_book)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='books/(?P<book_identifier>[^/]+)')
    def remove_book(self, request, pk=None, book_identifier=None):
        shelf = self.get_object()

        try:
            # Look up book by either primary key (if digit) or open_library_id string
            if book_identifier.isdigit():
                book = Book.objects.get(id=int(book_identifier))
            else:
                book = Book.objects.get(open_library_id=book_identifier)

            shelf_book = ShelfBook.objects.get(shelf=shelf, book=book)
            shelf_book.delete()
            return Response({'status': 'Book removed from shelf'}, status=status.HTTP_200_OK)
        except (Book.DoesNotExist, ShelfBook.DoesNotExist):
            return Response({'error': 'Book is not on this shelf'}, status=status.HTTP_404_NOT_FOUND)
