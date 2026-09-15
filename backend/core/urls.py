from django.urls import path
from .views import ChatQueryView, HelplineListView

urlpatterns = [
    path('chat/', ChatQueryView.as_view(), name='chat'),
    path('helplines/', HelplineListView.as_view(), name='helplines'),
]