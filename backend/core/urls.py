from django.urls import path
from .views import ChatQueryView, HelplineListView , ChatSessionDetailView

urlpatterns = [
    path('chat/', ChatQueryView.as_view(), name='chat'),
    path('helplines/', HelplineListView.as_view(), name='helplines'),
    path('chat/<slug:slug>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),
]