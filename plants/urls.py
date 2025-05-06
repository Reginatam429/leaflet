from django.urls import path
from . import views

urlpatterns = [
    path('my-plants/', views.plant_list, name='plant_list'),
    
    # path('wishlist/', views.wishlist, name='wishlist'),
    # path('wishlist/add/<int:plant_id>/', views.add_to_wishlist, name='add_to_wishlist'),
    # path('wishlist/remove/<int:plant_id>/', views.remove_from_wishlist, name='remove_from_wishlist'),
]
