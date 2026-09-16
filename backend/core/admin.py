from django.contrib import admin
from .models import Helpline, QueryLog, GlobalResourceCache

admin.site.register(Helpline)
admin.site.register(QueryLog)
admin.site.register(GlobalResourceCache)