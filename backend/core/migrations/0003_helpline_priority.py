from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_globalresourcecache"),
    ]

    operations = [
        migrations.AddField(
            model_name='helpline',
            name='priority',
            field=models.PositiveSmallIntegerField(choices=[(1, 'National'), (2, 'State'), (3, 'District'), (4, 'Local / Specialized')], db_index=True, default=1),
        ),
    ]
