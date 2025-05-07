from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Plant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plants')
    date_added = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='plant_images/', blank=True, null=True, default='plant_images/default.png')

    nickname = models.CharField(max_length=100)
    species = models.CharField(max_length=100)  # Scientific name
    common_name = models.CharField(max_length=100, blank=True)
    other_names = models.JSONField(blank=True, null=True)

    watering = models.CharField(
        max_length=20, blank=True,
        choices=[('frequent', 'Frequent'), ('average', 'Average'), ('minimum', 'Minimum'), ('none', 'None')]
    )
    sunlight = models.CharField(
        max_length=20, blank=True,
        choices=[
            ('full_shade', 'Full Shade'),
            ('part_shade', 'Partial Shade'),
            ('sun-part_shade', 'Sun to Partial Shade'),
            ('full_sun', 'Full Sun')
        ]
    )

    info_summary = models.TextField(blank=True)

    last_watered = models.DateField(null=True, blank=True)
    water_interval_days = models.PositiveIntegerField(default=7)

    def __str__(self):
        return f"{self.nickname} ({self.species})"
    
class WishlistPlant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_plants')
    perenual_id = models.PositiveIntegerField(null=True, blank=True)  # Store Perenual's unique plant ID
    species = models.CharField(max_length=100)   # Scientific name
    common_name = models.CharField(max_length=100, blank=True)
    other_names = models.JSONField(blank=True, null=True)

    watering = models.CharField(
        max_length=20, blank=True,
        choices=[('frequent', 'Frequent'), ('average', 'Average'), ('minimum', 'Minimum'), ('none', 'None')]
    )
    sunlight = models.CharField(
        max_length=20, blank=True,
        choices=[
            ('full_shade', 'Full Shade'),
            ('part_shade', 'Partial Shade'),
            ('sun-part_shade', 'Sun to Partial Shade'),
            ('full_sun', 'Full Sun')
        ]
    )
    info_summary = models.TextField(blank=True)
    image_url = models.URLField(blank=True)  # Optional thumbnail or photo from Perenual

    notes = models.TextField(blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.common_name or self.species} (wishlist)"

class PhotoIdentification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photo_identifications')
    image = models.ImageField(upload_to='plant_photos/')
    result_species = models.CharField(max_length=100, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ID Result: {self.result_species or 'Pending'} ({self.confidence or 'N/A'})"
