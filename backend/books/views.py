from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer
from .services.open_library import search_books, get_book_details

class BookSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Query parameter q is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        results = search_books(query)
        return Response(results)

class HomeFeedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves feed items for the dashboard:
        - Latest Releases
        - BookTok Sensations
        - You Would Like
        """
        # Fetch feeds concurrently/sequentially using Open Library search
        latest = search_books("subject:fiction publish_year:2025", limit=6)
        # If no results, try fallback
        if not latest:
            latest = search_books("fiction 2024", limit=6)
            
        booktok = search_books("romance fantasy trending", limit=6)
        if not booktok:
            booktok = search_books("love story", limit=6)
            
        you_would_like = search_books("cozy classics nature", limit=6)
        if not you_would_like:
            you_would_like = search_books("cottagecore", limit=6)

        return Response({
            'latest_releases': latest,
            'booktok_sensations': booktok,
            'you_would_like': you_would_like
        })

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'open_library_id'

    def retrieve(self, request, *args, **kwargs):
        """
        Attempts to fetch local DB record by open_library_id.
        If it doesn't exist, queries Open Library details, saves locally, and returns.
        """
        open_library_id = self.kwargs.get('open_library_id')
        try:
            book = Book.objects.get(open_library_id=open_library_id)
            if not book.description:
                details = get_book_details(open_library_id)
                if details and details.get('description'):
                    book.description = details['description']
                    book.save()
            serializer = self.get_serializer(book)
            return Response(serializer.data)
        except Book.DoesNotExist:
            details = get_book_details(open_library_id)
            if not details:
                return Response({'error': 'Book details could not be retrieved from Open Library.'}, status=status.HTTP_404_NOT_FOUND)
            
            title = request.query_params.get('title') or details.get('title') or 'Untitled'
            author = request.query_params.get('author') or 'Unknown Author'
            cover_url = request.query_params.get('cover_url') or details.get('cover_url')
            
            book = Book.objects.create(
                open_library_id=open_library_id,
                title=title,
                author=author,
                cover_url=cover_url,
                description=details.get('description'),
            )
            serializer = self.get_serializer(book)
            return Response(serializer.data)
