# Generated by Django 4.1.3 on 2023-02-19 19:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="customuser",
            name="votes",
        ),
    ]