from django.http import request
from django.shortcuts import render


def about(request):
    return render(request, "about.html")


def base(request):
    return render(request, "base.html")


def checkout(request):
    return render(request, "checkout.html")


def contact(request):
    return render(request, "contact.html")


def dashboard(request):
    return render(request, "dashboard.html")


def index(request):
    return render(request, "index.html")


def login(request):
    return render(request, "login.html")


def services(request):
    return render(request, "services.html")


def signup(request):
    return render(request, "signup.html")


def template_detail(request):
    return render(request, "template_detail.html")


def templates(request):
    return render(request, "templates.html")
