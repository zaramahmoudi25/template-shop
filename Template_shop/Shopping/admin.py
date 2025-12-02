from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ThemeForestItem, UserTemplate
from django.core.files.base import ContentFile
from django.utils.html import format_html
from django.utils.text import slugify
import requests
import mimetypes


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'phone', 'country_code', 'newsletter', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'newsletter')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('phone', 'country_code', 'national_card', 'verification_video')}),
        ('Preferences', {'fields': ('newsletter',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'phone', 'country_code', 'national_card',
                       'verification_video', 'newsletter', 'is_staff', 'is_active')
        }),
    )

    ordering = ('email',)


@admin.register(ThemeForestItem)
class ThemeForestItemAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price", "rating", "sales", "image_preview")
    search_fields = ("title", "category")
    prepopulated_fields = {"slug": ("title",)}

    readonly_fields = (
        "themeforest_url",
        "live_preview_url",
        "main_image_url",
        "price",
        "sales",
        "rating",
        "rating_count",
        "version",
        "last_update",
        "compatible_with",
        "image_preview"
    )

    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category')
        }),
        ('ThemeForest Information', {
            'fields': ('themeforest_url', 'live_preview_url', 'main_image_url', 'main_image', 'image_preview')
        }),
        ('Details', {
            'fields': ('price', 'sales', 'rating', 'rating_count')
        }),
        ('Extended Information', {
            'fields': ('version', 'last_update', 'compatible_with', 'description', 'tags'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="max-height:120px;">',
                obj.main_image.url,
            )
        return "(no image)"

    image_preview.short_description = "Preview"

    def save_model(self, request, obj, form, change):
        # Check if main_image_url is provided and main_image is empty
        if obj.main_image_url and not obj.main_image:
            try:
                print(f"Attempting to download image from: {obj.main_image_url}")

                response = requests.get(
                    obj.main_image_url,
                    headers={"User-Agent": "Mozilla/5.0"},
                    timeout=20
                )

                if response.status_code == 200:
                    # Detect file extension
                    content_type = response.headers.get("Content-Type", "")
                    ext = mimetypes.guess_extension(content_type) or ".jpg"

                    # Clean up extension (remove .jpe -> .jpg)
                    if ext == '.jpe':
                        ext = '.jpg'

                    filename = f"{obj.slug or slugify(obj.title)}{ext}"

                    print(f"Saving image as: {filename}")

                    # Save the image
                    obj.main_image.save(filename, ContentFile(response.content), save=False)

                    print("Image downloaded and saved successfully!")
                else:
                    print(f"Failed to download image. Status code: {response.status_code}")

            except Exception as e:
                print(f"Error downloading image: {e}")
                # You can also show this error to the user
                self.message_user(request, f"Error downloading image: {e}", level="ERROR")

        # Save the model
        super().save_model(request, obj, form, change)

    def download_main_image(self, request, queryset):
        print("Action started")
        for item in queryset:
            if not item.main_image_url:
                continue

            try:
                response = requests.get(
                    item.main_image_url,
                    headers={"User-Agent": "Mozilla/5.0"},
                    timeout=20
                )

                if response.status_code == 200:
                    content_type = response.headers.get("Content-Type", "")
                    ext = mimetypes.guess_extension(content_type) or ".jpg"

                    if ext == '.jpe':
                        ext = '.jpg'

                    filename = f"{item.slug}{ext}"
                    item.main_image.save(filename, ContentFile(response.content), save=True)
                    self.message_user(request, f"Downloaded image for {item.title}", level="SUCCESS")

            except Exception as e:
                self.message_user(request, f"Error downloading {item.title}: {e}", level="ERROR")

    download_main_image.short_description = "Download selected theme images"


@admin.register(UserTemplate)
class UserTemplateAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "category", "approved", "created_at")
    search_fields = ("title", "user__email")
    list_filter = ("approved", "category")
    readonly_fields = ("created_at",)