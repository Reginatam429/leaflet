from django.urls import path
from . import views

urlpatterns = [
    path('search-plants/', views.search_plants, name='search_plants'),
    path('plant-details/<int:plant_id>/', views.plant_details, name='plant_details'),
    path('my-plants/', views.plant_list, name='plant_list'),
    path('wishlist/', views.wishlist_view, name='wishlist'),
    path('add-to-wishlist/', views.add_to_wishlist, name='add_to_wishlist'),
    path('delete-from-wishlist/<int:plant_id>/', views.delete_from_wishlist, name='delete_from_wishlist'),
    path('add-from-wishlist-to-myplants/', views.add_from_wishlist_to_myplants, name='add_from_wishlist_to_myplants'),
    path('identify/', views.identify_plant, name='identify_plant'),
]
