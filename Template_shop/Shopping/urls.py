from django.urls import path
from . import views

urlpatterns = [
    path('about/', views.about),
    path('base/', views.base),
    path('checkout/', views.checkout),
    path('contact/', views.contact),
    path('dashboard/', views.dashboard),
    path('', views.index),
    path('index/', views.index),
    path('login/', views.login),
    path('services/', views.services),
    path('signup/', views.signup),
    path('templates/', views.templates),

]
