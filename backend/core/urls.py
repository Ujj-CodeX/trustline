from django.urls import path
from .views import ChatQueryView, HelplineListView , ChatSessionDetailView , SitemapDataView, TranslateUITextView

urlpatterns = [
    path('chat/', ChatQueryView.as_view(), name='chat'),
    path('helplines/', HelplineListView.as_view(), name='helplines'),
    path('chat/<slug:slug>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),
    path('sitemap-data/', SitemapDataView.as_view(), name='sitemap-data'),
    path("translate-ui/", TranslateUITextView.as_view(), name="translate-ui"),
]

