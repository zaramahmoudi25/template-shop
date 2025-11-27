from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout as django_logout, authenticate
from .forms import SignUpForm, EmailLoginForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import ThemeForestItem
from django.db.models import Q
from .models import UserTemplate
from django.http import JsonResponse
from django.db.models.functions import TruncMonth
from django.db.models import Sum, Count
import json


def about(request):
    return render(request, "about.html")


def base(request):
    return render(request, "base.html")


def checkout(request):
    return render(request, "checkout.html")


def contact(request):
    return render(request, "contact.html")


def dashboard_chart_data(user):
    # Earnings per month
    earnings = (
        UserTemplate.objects.filter(user=user, approved=True)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(total=Sum("price_suggestion"))
        .order_by("month")
    )

    earning_labels = [e["month"].strftime("%Y-%m") for e in earnings]
    earning_values = [int(e["total"]) if e["total"] else 0 for e in earnings]

    # Sales (count) per category
    categories = (
        UserTemplate.objects.filter(user=user)
        .values("category")
        .annotate(total=Count("id"))
    )

    category_labels = [c["category"] for c in categories]
    category_values = [c["total"] for c in categories]

    return {
        "earning_labels": json.dumps(earning_labels),
        "earning_values": json.dumps(earning_values),
        "category_labels": json.dumps(category_labels),
        "category_values": json.dumps(category_values),
    }


@login_required
def dashboard(request):
    user = request.user

    total_uploaded = UserTemplate.objects.filter(user=user).count()
    total_active = UserTemplate.objects.filter(user=user, approved=True).count()

    total_revenue = UserTemplate.objects.filter(user=user, approved=True).aggregate(
        Sum("price_suggestion")
    )["price_suggestion__sum"] or 0

    user_templates = UserTemplate.objects.filter(user=user)

    chart_data = dashboard_chart_data(user)

    return render(request, "dashboard.html", {
        "total_uploaded": total_uploaded,
        "total_active": total_active,
        "total_revenue": total_revenue,
        "user_templates": user_templates,
        **chart_data,
    })


def index(request):
    return render(request, "index.html")


def services(request):
    return render(request, "services.html")


def template_detail(request, slug):
    # Try to find a ThemeForest template first
    try:
        template = ThemeForestItem.objects.get(slug=slug)
        template_type = "themeforest"
    except ThemeForestItem.DoesNotExist:
        # If not found, try user templates
        template = get_object_or_404(UserTemplate, slug=slug)
        template_type = "user"

    return render(request, "template-detail.html", {
        "template": template,
        "template_type": template_type,
    })


# def user_template_detail(request, slug):
#     template = get_object_or_404(UserTemplate, slug=slug)
#
#     return render(request, "user_template_detail.html", {
#         "template": template
#     })


def templates_list(request):
    # Get ThemeForest items
    theme_items = ThemeForestItem.objects.all()
    for t in theme_items:
        t.template_type = "themeforest"  # <- annotate each ThemeForest item

    # Get approved User templates
    user_items = UserTemplate.objects.filter(approved=True)
    for u in user_items:
        u.template_type = "user"  # <- annotate each User template

    # Combine them
    combined = list(theme_items) + list(user_items)

    # Handle search query
    search_query = request.GET.get('q', '')
    if search_query:
        theme_items = theme_items.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__icontains=search_query) |
            Q(tags__icontains=search_query)
        )
        for t in theme_items:
            t.template_type = "themeforest"

        user_items = user_items.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__icontains=search_query) |
            Q(tags__icontains=search_query)
        )
        for u in user_items:
            u.template_type = "user"

        combined = list(theme_items) + list(user_items)

    # Pass to template
    return render(request, 'templates.html', {
        'items': combined,
        'search_query': search_query,
    })


def youtube_adsense(request):
    return render(request, "youtube-adsense.html")


# ------------------------------------------------- #


def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "ثبت‌نام با موفقیت انجام شد!")
            return redirect('/dashboard/')

        else:
            messages.error(request, "لطفاً خطاهای فرم را بررسی کنید.")
    else:
        form = SignUpForm()

    return render(request, 'signup.html', {'form': form})


def login_view(request):
    remember = request.POST.get('remember')
    if not remember:
        request.session.set_expiry(0)

    if request.method == 'POST':
        form = EmailLoginForm(request.POST)
        if form.is_valid():
            user = form.user
            login(request, user)
            next_url = request.GET.get('next', '/dashboard/')
            return redirect(next_url)
        return render(request, 'login.html', {'form': form})

    form = EmailLoginForm()
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    django_logout(request)
    return redirect('login')


@login_required
def upload_template(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid method"}, status=400)

    # Text fields
    title = request.POST.get("title")
    description = request.POST.get("description")
    category = request.POST.get("category")
    tags = request.POST.get("tags", "")
    price = request.POST.get("price", None)

    # Features JSON string
    features_json = request.POST.get("features", "[]")

    # Files
    thumbnail = request.FILES.get("thumbnail")
    zip_file = request.FILES.get("file")

    if not thumbnail or not zip_file:
        return JsonResponse({"status": "error", "message": "Thumbnail and ZIP are required"}, status=400)

    # Create template entry
    template = UserTemplate.objects.create(
        user=request.user,
        title=title,
        description=description,
        category=category,
        tags=tags,
        price_suggestion=price,
        thumbnail=thumbnail,
        zip_file=zip_file,
        features=features_json
    )

    # Handle multiple images
    images = []
    for img in request.FILES.getlist("images"):
        file_path = f"user_templates/screenshots/{template.slug}_{img.name}"
        # Save file
        saved_path = template.thumbnail.storage.save(file_path, img)
        images.append(saved_path)

    template.images = images
    template.save()

    return JsonResponse({"status": "success", "message": "Template uploaded successfully!"})