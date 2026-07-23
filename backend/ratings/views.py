from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Rating
from .serializers import RatingSerializer

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Rating.objects.filter(user=self.request.user).order_by('-updated_at')
        open_library_id = self.request.query_params.get('open_library_id')
        if open_library_id:
            queryset = queryset.filter(book__open_library_id=open_library_id)
        return queryset
