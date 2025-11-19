from django.urls import path
from . import views

urlpatterns = [
    path('about/', views.about),
    path('base/', views.base),
    path('checkout/', views.checkout),
    path('contact/', views.contact),
    path('dashboard/', views.dashboard),
    path('feedback/', views.feedback),
    path('', views.index),
    path('index/', views.index),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('services/', views.services),
    path('signup/', views.signup_view, name='signup'),
    path('templates/', views.templates),
    path('template-detail/', views.template_detail),
    path('youtube-adsense/', views.youtube_adsense),

]
