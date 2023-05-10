from django.test import TestCase
from rest_framework.test import APIClient
from .models import CustomUser, Ping, Comment
from rest_framework_simplejwt.tokens import AccessToken
from django.urls import reverse

class ViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test users
        self.test_user1 = CustomUser.objects.create_user(email='test1@example.com', password='testpassword123', alias='TestUser1')
        self.test_user2 = CustomUser.objects.create_user(email='test2@example.com', password='testpassword123', alias='TestUser2')

        # Create sample ping
        self.sample_ping = Ping.objects.create(
            ping_type='pavement',
            lat='40.712776',
            long='-74.005974',
            desc='Sample ping description',
            creator=self.test_user1
        )
        
        # Create sample comment
        self.sample_comment = Comment.objects.create(
            text='Sample comment text',
            ping=self.sample_ping,
            creator=self.test_user1
        )

        # Generate JWT access tokens
        self.user1_token = str(AccessToken.for_user(self.test_user1))
        self.user2_token = str(AccessToken.for_user(self.test_user2))

    def test_ping_list(self):
        response = self.client.get('/api/pings/', HTTP_AUTHORIZATION=f'Bearer {self.user1_token}')
        print(response.json())
        self.assertEqual(response.status_code, 200)

    def test_upvote_ping(self):
        response = self.client.post(f'/api/pings/{self.sample_ping.pk}/upvote/', HTTP_AUTHORIZATION=f'Bearer {self.user1_token}')
        self.assertEqual(response.status_code, 200)

    def test_downvote_ping(self):
        response = self.client.post(f'/api/pings/{self.sample_ping.pk}/downvote/', HTTP_AUTHORIZATION=f'Bearer {self.user1_token}')
        self.assertEqual(response.status_code, 200)

    def test_cancel_vote(self):
        # Upvote the ping first
        self.client.post(f'/api/pings/{self.sample_ping.pk}/upvote/', HTTP_AUTHORIZATION=f'Bearer {self.user1_token}')
        response = self.client.post(f'/api/pings/{self.sample_ping.pk}/cancel_vote/', HTTP_AUTHORIZATION=f'Bearer {self.user1_token}')
        self.assertEqual(response.status_code, 200)

    def test_delete_comment(self):
        response = self.client.delete(f'/api/comments/{self.sample_comment.pk}/delete/', HTTP_AUTHORIZATION=f'Bearer {self.user1_token}')
        self.assertEqual(response.status_code, 200)

    def test_delete_comment_not_allowed(self):
        response = self.client.delete(f'/api/comments/{self.sample_comment.pk}/delete/', HTTP_AUTHORIZATION=f'Bearer {self.user2_token}')
        self.assertEqual(response.status_code, 400)