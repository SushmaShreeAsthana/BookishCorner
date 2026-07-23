from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    display_name = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def get_cleaned_data(self):
        cleaned_data = super().get_cleaned_data()
        cleaned_data['display_name'] = self.validated_data.get('display_name', '')
        return cleaned_data

    def save(self, request):
        user = super().save(request)
        user.display_name = self.cleaned_data.get('display_name', '')
        user.save()
        return user

class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'display_name')
        read_only_fields = ('email',)
