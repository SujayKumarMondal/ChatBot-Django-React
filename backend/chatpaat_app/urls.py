from django.urls import path 
from . import views 
from django.http import JsonResponse
from django.shortcuts import render

def home(request):
    return render(request, "index.html")


urlpatterns = [
    path("", home, name="home"),
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path("api/login/", views.login_view, name="login"),
    path("prompt_gpt/", views.prompt_gpt, name="prompt_gpt"),
    path("chats/<uuid:pk>/", views.get_chat_messages, name="get_chat_messages"),
    path("get_chat_messages/<str:pk>/", views.get_chat_messages, name="get_chat_messages"),
    path("todays_chat/", views.todays_chat, name="todays_chat"),
    path("yesterdays_chat/", views.yesterdays_chat, name="yesterdays_chat"),
    path("seven_days_chat/", views.seven_days_chat, name="seven_days_chat"),
    path("api/store_search/", views.user_search, name="store_user_search")
]
