from django.urls import path
from . import views

urlpatterns = [
    path('about/', views.about),
    path('base/', views.base),
    path('cart/', views.cart),
    path('checkout/', views.checkout),
    path('contact/', views.contact),
    path('dashboard/', views.dashboard),
    path('', views.index),
    path('index/', views.index),
    path('login/', views.login),
    path('signup/', views.signup),
    path('template_detail/', views.template_detail),

]
