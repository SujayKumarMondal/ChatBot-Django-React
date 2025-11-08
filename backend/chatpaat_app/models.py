# backend/chatpaat_app/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    # keep email unique for this project
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


class Chat(models.Model):
    """
    A simple Chat model holding an id, optional title, timestamps, and user association.
    Messages are in ChatMessage (related_name='messages').
    """
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='chats', null=True, blank=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title or str(self.id)}"


class ChatMessage(models.Model):
    ROLES = (("assistant", "assistant"), ("user", "user"))

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=15, choices=ROLES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"


class UserSearchHistory(models.Model):
    """
    Model to store user search history.
    """
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='search_histories')
    search_query = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.search_query[:50]}"
