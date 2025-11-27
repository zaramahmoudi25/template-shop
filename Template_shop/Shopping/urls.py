from django.urls import path
from . import views
from .views import template_detail

urlpatterns = [
    path('about/', views.about),
    path('base/', views.base),
    path('checkout/', views.checkout),
    path('contact/', views.contact),
    path('dashboard/', views.dashboard),
    path('', views.index),
    path('index/', views.index),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('services/', views.services),
    path('signup/', views.signup_view, name='signup'),
    path('templates/', views.templates_list, name='templates_list'),
    path('template-detail/', views.template_detail),
    path('youtube-adsense/', views.youtube_adsense),

    path("templates/<slug:slug>/", template_detail, name="template_detail"),
    path("upload-template/", views.upload_template, name="upload_template"),

]
