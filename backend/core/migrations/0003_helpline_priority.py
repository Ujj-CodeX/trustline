from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_globalresourcecache"),
    ]

    operations = [
        migrations.AddField(
            model_name="helpline",
            name="priority",
            field=models.PositiveSmallIntegerField(default=1),
        ),
    ]
