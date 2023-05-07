# Generated by Django 4.1.3 on 2023-05-06 16:25

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_alter_ping_ping_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ping",
            name="rating",
            field=models.IntegerField(
                validators=[
                    django.core.validators.MaxValueValidator(10),
                    django.core.validators.MinValueValidator(0),
                ]
            ),
        ),
    ]
