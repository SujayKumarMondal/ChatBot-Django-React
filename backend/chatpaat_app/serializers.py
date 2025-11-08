from rest_framework import serializers

from chatpaat_app.models import Chat, ChatMessage, UserSearchHistory 

     

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat 
        fields = "__all__"



# class ChatMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ChatMessage 
#         fields = ["id", "role", "content", "created_at"]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage 
        fields = ["role", "content"]


class UserSearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSearchHistory
        fields = "__all__"