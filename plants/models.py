from django.db import models
from django.contrib.auth.models import User

class Plant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plants')
    nickname = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    last_watered = models.DateField(null=True, blank=True)
    water_interval_days = models.PositiveIntegerField(default=7)

    def __str__(self):
        return f"{self.nickname} ({self.species})"

class WishlistPlant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_plants')
    species = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.species} (wishlist)"

class PhotoIdentification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photo_identifications')
    image = models.ImageField(upload_to='plant_photos/')
    result_species = models.CharField(max_length=100, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ID Result: {self.result_species or 'Pending'} ({self.confidence or 'N/A'})"
