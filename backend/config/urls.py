from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.shortcuts import redirect

# Import views
from books.views import BookViewSet, BookSearchAPIView, HomeFeedAPIView
from shelves.views import ShelfViewSet
from ratings.views import RatingViewSet
from users.views import ProfileStatsAPIView, GoogleLogin

def root_redirect(request):
    return redirect('http://localhost:5173/')

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'shelves', ShelfViewSet, basename='shelf')
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    path('', root_redirect, name='root-redirect'),
    path('admin/', admin.site.urls),

    
    # Auth endpoints
    path('api/v1/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/v1/auth/', include('dj_rest_auth.urls')),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Proxy / feed / stats endpoints
    path('api/v1/books/search/', BookSearchAPIView.as_view(), name='book-search'),
    path('api/v1/home/feed/', HomeFeedAPIView.as_view(), name='home-feed'),
    path('api/v1/profile/', ProfileStatsAPIView.as_view(), name='profile-stats'),
    
    # ViewSets
    path('api/v1/', include(router.urls)),
]

