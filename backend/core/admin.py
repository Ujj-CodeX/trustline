from django.contrib import admin
from .models import Helpline, QueryLog, GlobalResourceCache, ChatSession

admin.site.register(Helpline)
admin.site.register(QueryLog)
admin.site.register(GlobalResourceCache)
admin.site.register(ChatSession)