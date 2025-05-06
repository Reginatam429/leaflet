from django.contrib import admin
from django.urls import path, include  # include added here
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from plants import views as plant_views

urlpatterns = [
    path('', plant_views.welcome, name='welcome'),
    path('dashboard/', plant_views.dashboard, name='dashboard'),
    path('signup/', plant_views.signup, name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/login/'), name='logout'),
    path('admin/', admin.site.urls),

    path('plants/', include('plants.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
