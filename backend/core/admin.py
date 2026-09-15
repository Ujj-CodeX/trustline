from django.contrib import admin
from .models import Helpline, QueryLog

admin.site.register(Helpline)
admin.site.register(QueryLog)