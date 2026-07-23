from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from shelves.models import Shelf
from books.models import Book
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

User = get_user_model()

class ProfileStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Count total shelves for the user
        total_shelves = Shelf.objects.filter(user=user).count()
        
        # Count unique books across all the user's shelves
        total_books_tracked = Book.objects.filter(shelf_assignments__shelf__user=user).distinct().count()
        
        # Count unique books on default shelves
        completed_count = Book.objects.filter(
            shelf_assignments__shelf__user=user, 
            shelf_assignments__shelf__name='Completed'
        ).distinct().count()
        
        want_to_read_count = Book.objects.filter(
            shelf_assignments__shelf__user=user, 
            shelf_assignments__shelf__name='Want to Read'
        ).distinct().count()
        
        currently_reading_count = Book.objects.filter(
            shelf_assignments__shelf__user=user, 
            shelf_assignments__shelf__name='Currently Reading'
        ).distinct().count()

        return Response({
            'username': user.username,
            'display_name': user.display_name or user.username,
            'email': user.email,
            'date_joined': user.date_joined,
            'stats': {
                'total_shelves': total_shelves,
                'total_books_tracked': total_books_tracked,
                'completed_books': completed_count,
                'want_to_read_books': want_to_read_count,
                'currently_reading_books': currently_reading_count
            }
        })


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = 'http://localhost:5173'

