from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from plants import views as plant_views
from plants import views
from django.contrib import messages
from django.contrib.auth.views import LogoutView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Custom logout view that allows GET and shows a success message
class CustomLogoutView(LogoutView):
    next_page = 'welcome'

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        if request.method == 'GET':
            messages.success(request, "You have successfully logged out.")
            return self.post(request, *args, **kwargs)
        return super().dispatch(request, *args, **kwargs)

urlpatterns = [
    path('', plant_views.welcome, name='welcome'),
    path('dashboard/', plant_views.dashboard, name='dashboard'),
    path('signup/', plant_views.signup, name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('admin/', admin.site.urls),

    path('plants/', include('plants.urls')),
    path('my-plants/', views.plant_list, name='plant_list'),
    path('search-plants/', views.search_plants, name='search_plants'),
    path('plant-details/<int:plant_id>/', views.plant_details, name='plant_details'),
    path('add-to-wishlist/', views.add_to_wishlist, name='add_to_wishlist'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
