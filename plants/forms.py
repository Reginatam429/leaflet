from django import forms
from .models import Plant

class PlantForm(forms.ModelForm):
    class Meta:
        model = Plant
        fields = [
            'image',
            'nickname',
            'species',
            'last_watered',
            'water_interval_days',
            'care_instructions',
            'suggested_water_days',
            'sunlight',
            'watering',
            'soil'
        ]
