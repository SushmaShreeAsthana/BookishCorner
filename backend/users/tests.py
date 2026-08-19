from django.test import TestCase
from django.contrib.auth import get_user_model
from shelves.models import Shelf
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

User = get_user_model()

class UserSignalTests(TestCase):
    def test_default_shelves_created_on_signup(self):
        """
        Verify that registering a user automatically sets up three default shelves
        (Currently Reading, Want to Read, Completed).
        """
        user = User.objects.create_user(
            username='jane_austen', 
            email='jane@example.com', 
            password='cozyreadingnest123'
        )
        
        # Query shelves for user
        user_shelves = Shelf.objects.filter(user=user)
        
        # Verify exactly 3 shelves were created
        self.assertEqual(user_shelves.count(), 3)
        
        # Verify names match
        names = set(user_shelves.values_list('name', flat=True))
        expected_names = {'Currently Reading', 'Want to Read', 'Completed'}
        self.assertEqual(names, expected_names)
        
        # Verify they are all flagged as default
        for shelf in user_shelves:
            self.assertTrue(shelf.is_default)


class GoogleLoginTests(APITestCase):
    @patch('users.views.requests.get')
    def test_google_login_success(self, mock_get):
        # mock successful response from Google tokeninfo API
        mock_response = mock_get.return_value
        mock_response.ok = True
        mock_response.json.return_value = {
            "iss": "https://accounts.google.com",
            "sub": "1234567890", # Google user ID
            "aud": "894727701777-4r0c5i1bmqeqqj470q20vhptt1r022v7.apps.googleusercontent.com",
            "email": "testuser@example.com",
            "email_verified": True,
            "name": "Test User",
            "given_name": "Test",
            "family_name": "User",
            "picture": "https://example.com/test.jpg",
        }

        url = reverse('google_login')
        data = {
            'access_token': 'dummy_access_token',
            'id_token': 'valid_id_token'
        }
        response = self.client.post(url, data, format='json')
        
        # Should return HTTP 200 OK with the login key/token
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('key', response.data)
        
        # Verify user was created in the database
        user = User.objects.get(email='testuser@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.display_name, 'Test User')
        
        # Check that default shelves were created for the user
        self.assertEqual(user.shelves.count(), 3)

    @patch('users.views.requests.get')
    def test_google_login_invalid_token(self, mock_get):
        # mock failed response from Google tokeninfo API
        mock_response = mock_get.return_value
        mock_response.ok = False

        url = reverse('google_login')
        data = {
            'access_token': 'dummy_access_token',
            'id_token': 'invalid_id_token'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('users.views.requests.get')
    def test_google_login_audience_mismatch(self, mock_get):
        # mock response from Google tokeninfo API with different aud
        mock_response = mock_get.return_value
        mock_response.ok = True
        mock_response.json.return_value = {
            "iss": "https://accounts.google.com",
            "sub": "1234567890",
            "aud": "wrong-client-id", # mismatch
            "email": "testuser@example.com",
        }

        url = reverse('google_login')
        data = {
            'access_token': 'dummy_access_token',
            'id_token': 'some_id_token'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

