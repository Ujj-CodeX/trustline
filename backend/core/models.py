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
    ('health_emergency', 'Health Emergency'),
    ('animal_husbandry', 'Animal Husbandry'),
    ('senior_citizen', 'Senior Citizen Support'),
    ('disaster_relief', 'Disaster Relief'),
    ('labour_rights', 'Labour Rights'),
    ('consumer_complaint', 'Consumer Complaint'),
    ('road_accident', 'Road Accident'),
    ('missing_person', 'Missing Person'),
    ('general', 'General Emergency'),
]

    PRIORITY_CHOICES = [

        (1, "National"),
        (2, "State"),
        (3, "District"),
        (4, "Local / Specialized"),

    ]



    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    country = models.CharField(max_length=100,default='India',db_index=True)
    state = models.CharField(max_length=100, blank=True, null=True,db_index=True)
    district = models.CharField(max_length=100, blank=True, null=True)

    priority = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES, default=1,db_index=True,)



    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    languages = models.CharField(max_length=200, blank=True, null=True)
    available_24x7 = models.BooleanField(default=True)
    verified_by = models.CharField(max_length=200, blank=True, null=True)
    last_verified_date = models.DateField(blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True, help_text="Extra context for LLM — designation, special instructions, eligibility criteria etc.")

    class Meta:
        ordering = ["-priority", "name"]

        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["country", "category"]),
            models.Index(fields=["state", "district", "category"]),
            models.Index(fields=["priority"]),
    ]






    def __str__(self):
        return (
            f"{self.name} "
            f"({self.country}/{self.state}/{self.district})"
        )

class QueryLog(models.Model):
    query_text = models.TextField()
    country = models.CharField(max_length=50, blank=True)
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

class ChatSession(models.Model):
    slug = models.SlugField(max_length=255, unique=True)
    category = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
     
    class Meta:
        indexes = [models.Index(fields=["slug"])]


