# Generated by Django 4.1.3 on 2023-05-05 02:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_alter_ping_lat_alter_ping_long_alter_ping_ping_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="path",
            name="end_lat",
            field=models.DecimalField(decimal_places=18, max_digits=23),
        ),
        migrations.AlterField(
            model_name="path",
            name="end_long",
            field=models.DecimalField(decimal_places=18, max_digits=23),
        ),
        migrations.AlterField(
            model_name="path",
            name="start_lat",
            field=models.DecimalField(decimal_places=18, max_digits=23),
        ),
        migrations.AlterField(
            model_name="path",
            name="start_long",
            field=models.DecimalField(decimal_places=18, max_digits=23),
        ),
        migrations.AlterField(
            model_name="ping",
            name="lat",
            field=models.DecimalField(decimal_places=18, max_digits=23),
        ),
        migrations.AlterField(
            model_name="ping",
            name="long",
            field=models.DecimalField(decimal_places=18, max_digits=23),
        ),
    ]