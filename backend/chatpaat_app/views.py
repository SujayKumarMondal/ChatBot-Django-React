# views.py
import uuid
import os
from django.shortcuts import get_object_or_404
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from chatpaat_app.models import Chat, ChatMessage, UserSearchHistory
from chatpaat_app.serializers import ChatMessageSerializer, ChatSerializer
from django.utils import timezone
from datetime import timedelta
from chatpaat_app.models import CustomUser

# Groq settings
GROQ_API_KEY = getattr(settings, "GROQ_API_KEY", os.getenv("GROQ_API_KEY"))
GROQ_API_URL = getattr(settings, "GROQ_API_URL", os.getenv("GROQ_API_URL"))

User = get_user_model() 

# ======================= Groq Helper =======================

def createChatTitle(user_message: str) -> str:
    """
    Create a short title for the chat using Groq.
    Falls back to truncated user message on failure.
    """
    try:
        headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant. Provide a short descriptive title "
                        "for the user's conversation in 3-5 words. Do not add quotes."
                    ),
                },
                {"role": "user", "content": user_message},
            ],
            "max_tokens": 16,
            "temperature": 0.2,
        }
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        title = data["choices"][0]["message"]["content"].strip()
        if not title:
            title = user_message[:50]
    except Exception:
        title = user_message[:50]
    return title

# ======================= User Registration =======================

class RegisterView(APIView):
    """
    POST /api/register/
    {
        "username": "<username>",
        "email": "<email>",
        "password": "<password>"
    }
    Returns JWT tokens.
    """
    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return Response({"error": "Username, email, and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "username": user.username,
                "email": user.email,
            }
        }, status=status.HTTP_201_CREATED)
        
        
@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    # Authenticate manually
    if not user.check_password(password):
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {"username": user.username, "email": user.email},
    })# ======================= Chat / Groq Endpoints =======================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def prompt_gpt(request):
    data = request.data
    chat_id = data.get("chat_id")
    content = data.get("content")

    if not chat_id:
        chat_id = str(uuid.uuid4())
    if not content:
        return Response({"error": "No prompt content provided."}, status=400)

    # Always associate chat with user
    chat, created = Chat.objects.get_or_create(id=chat_id, defaults={"user": request.user})
    if not created and chat.user != request.user:
        return Response({"error": "Unauthorized access to chat."}, status=403)

    if not chat.title:
        try:
            chat.title = createChatTitle(content)
            chat.save()
        except Exception:
            pass

    ChatMessage.objects.create(role="user", chat=chat, content=content)
    chat_messages = chat.messages.order_by("created_at")[:20]
    groq_messages = [{"role": m.role, "content": m.content} for m in chat_messages]

    if not any(msg["role"] == "system" for msg in groq_messages):
        groq_messages.insert(0, {"role": "system", "content": "You are a helpful assistant."})

    try:
        headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": groq_messages,
            "max_tokens": 1024,
            "temperature": 0.6,
        }
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        groq_reply = data["choices"][0]["message"]["content"]
        if not groq_reply:
            raise RuntimeError("Groq returned no text.")
    except Exception as e:
        return Response({"error": f"Groq error: {str(e)}"}, status=500)

    ChatMessage.objects.create(role="assistant", chat=chat, content=groq_reply)
    return Response({"reply": groq_reply}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, pk):
    chat = get_object_or_404(Chat, id=pk)
    if chat.user != request.user:
        return Response({"error": "Unauthorized access to chat messages."}, status=403)
    messages = chat.messages.order_by("created_at")
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def todays_chat(request):
    today = timezone.now().date()
    chats = Chat.objects.filter(user=request.user, created_at__date=today).order_by("-created_at")[:10]
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def yesterdays_chat(request):
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    chats = Chat.objects.filter(user=request.user, created_at__date=yesterday).order_by("-created_at")[:10]
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seven_days_chat(request):
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    seven_days_ago = today - timedelta(days=7)
    chats = Chat.objects.filter(user=request.user, created_at__lt=yesterday, created_at__gte=seven_days_ago).order_by("-created_at")[:10]
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_search(request):
    """
    Endpoint to store user search queries.
    """
    search_query = request.data.get("search_query")

    if not search_query:
        return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Store the search query in the database
    UserSearchHistory.objects.create(user=request.user, search_query=search_query)

    return Response({"message": "Search query stored successfully."}, status=status.HTTP_201_CREATED)
