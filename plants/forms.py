from django import forms
from .models import Plant, WishlistPlant

class PlantForm(forms.ModelForm):
    class Meta:
        model = Plant
        fields = [
            'image',
            'nickname',
            'species',
            'common_name',
            'other_names',
            'watering',
            'sunlight',
            'info_summary',
            'last_watered',
            'water_interval_days'
        ]
class WishlistPlantForm(forms.ModelForm):
    class Meta:
        model = WishlistPlant
        fields = [
            'species',
            'common_name',
            'other_names',
            'watering',
            'sunlight',
            'info_summary',
            'image_url',
            'notes'
        ]