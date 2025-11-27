from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.text import slugify


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    phone = models.CharField(max_length=20, blank=True, null=True)
    country_code = models.CharField(max_length=10, default="+98")

    national_card = models.FileField(upload_to="national_cards/", blank=True, null=True)
    verification_video = models.FileField(upload_to="videos/", blank=True, null=True)

    newsletter = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class ThemeForestItem(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    themeforest_url = models.URLField()
    main_image = models.ImageField(upload_to="theme_images/", null=True, blank=True)
    main_image_url = models.URLField(null=True, blank=True)
    live_preview_url = models.URLField(null=True, blank=True, verbose_name="Live Preview URL")

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sales = models.IntegerField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    rating_count = models.IntegerField(null=True, blank=True)
    category = models.CharField(max_length=50, default="Shopify")

    # Extended fields
    version = models.CharField(max_length=50, null=True, blank=True)
    last_update = models.CharField(max_length=50, null=True, blank=True)
    compatible_with = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = models.TextField(max_length=500, null=True, blank=True,
                            help_text="Separate tags with commas")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class UserTemplate(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="templates")

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    description = models.TextField()
    category = models.CharField(max_length=50)
    tags = models.CharField(max_length=500, blank=True, help_text="Comma separated")

    price_suggestion = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    thumbnail = models.ImageField(upload_to="user_templates/thumbnails/")
    zip_file = models.FileField(upload_to="user_templates/files/")

    features = models.TextField(blank=True, help_text="JSON list of features")

    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)  # Admin must approve

    # Multiple images
    images = models.JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.user.email}"