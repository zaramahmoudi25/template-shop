from django.shortcuts import render, redirect
from django.contrib.auth import login, logout as django_logout, authenticate
from .forms import SignUpForm, EmailLoginForm
from django.contrib.auth.decorators import login_required


def about(request):
    return render(request, "about.html")


def base(request):
    return render(request, "base.html")


def checkout(request):
    return render(request, "checkout.html")


def contact(request):
    return render(request, "contact.html")


@login_required
def dashboard(request):
    user = request.user
    return render(request, "dashboard.html", {'user': user})


def feedback(request):
    return render(request, "feedback.html")


def index(request):
    return render(request, "index.html")


def services(request):
    return render(request, "services.html")


def template_detail(request):
    return render(request, "template-detail.html")


def templates(request):
    return render(request, "templates.html")


def youtube_adsense(request):
    return render(request, "youtube-adsense.html")


# ------------------------------------------------- #


def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard.html')  # change to your homepage/dashboard
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST['email']  # or use actual username field
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', '/dashboard/')
            return redirect(next_url)
        else:
            return render(request, 'login.html', {'error': 'اطلاعات اشتباه است'})
    return render(request, 'login.html')


def logout_view(request):
    django_logout(request)
    return redirect('login')
