# Generated by Django 4.1.3 on 2023-02-19 19:48

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomUser",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="email address"
                    ),
                ),
                ("is_staff", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "date_joined",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                (
                    "user_type",
                    models.CharField(
                        choices=[("jogger", "Jogger"), ("pedestrian", "Pedestrian")],
                        default="Jogger",
                        max_length=50,
                    ),
                ),
                ("votes", models.IntegerField(default=0)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Ping",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "ping_type",
                    models.CharField(
                        choices=[
                            ("pavement", "Pavement"),
                            ("road", "Road"),
                            ("scenary", "Scenary"),
                            ("busy", "Busy"),
                            ("litter", "Litter"),
                            ("wildlife", "Wildlife"),
                            ("shops", "Shops"),
                        ],
                        max_length=50,
                    ),
                ),
                ("date", models.DateField(auto_now_add=True)),
                ("lat", models.DecimalField(decimal_places=6, max_digits=23)),
                ("long", models.DecimalField(decimal_places=6, max_digits=23)),
                ("desc", models.CharField(max_length=200)),
                (
                    "rating",
                    models.IntegerField(
                        default=5,
                        validators=[
                            django.core.validators.MaxValueValidator(10),
                            django.core.validators.MinValueValidator(0),
                        ],
                    ),
                ),
                ("votes", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "creator",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="related_creator",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "voters",
                    models.ManyToManyField(
                        related_name="related_voters", to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Path",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("start_lat", models.DecimalField(decimal_places=6, max_digits=23)),
                ("start_long", models.DecimalField(decimal_places=6, max_digits=23)),
                ("end_lat", models.DecimalField(decimal_places=6, max_digits=23)),
                ("end_long", models.DecimalField(decimal_places=6, max_digits=23)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
