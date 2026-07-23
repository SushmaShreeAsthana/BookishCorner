from django.test import TestCase
from django.contrib.auth import get_user_model
from shelves.models import Shelf

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
