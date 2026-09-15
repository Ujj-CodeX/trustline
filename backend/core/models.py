from django.db import models

# Create your models here.
class Helpline(models.Model):
    CATEGORY_CHOICES = [
        ('cyber_crime', 'Cyber Crime'),
        ('domestic_violence', 'Domestic Violence'),
        ('mental_health', 'Mental Health'),
        ('child_helpline', 'Child Helpline'),
        ('women_safety', 'Women Safety'),
        ('legal_aid', 'Legal Aid'),
        ('general', 'General Emergency'),
    ]


    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    country = models.CharField(max_length=100,default='India')
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    languages = models.CharField(max_length=200, blank=True, null=True)
    available_24x7 = models.BooleanField(default=True)
    verified_by = models.CharField(max_length=200, blank=True, null=True)
    last_verified_date = models.DateField(blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)


    def __str__(self):
        return self.name

class QueryLog(models.Model):
    query_text = models.TextField()
    category = models.CharField(max_length=50, blank=True, null=True)
    urgency_tier = models.CharField(max_length=50, blank=True, null=True)
    location_detected = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QueryLog {self.id} - {self.created_at}"

class GlobalResourceCache(models.Model):
    source_name = models.CharField(max_length=100)
    source_url = models.URLField(blank=True, null=True)
    country = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    raw_data = models.JSONField()
    license_type = models.CharField(max_length=50, blank=True, null=True)
    fetched_at = models.DateTimeField(auto_now_add=True)
    ttl_expiry = models.DateTimeField()