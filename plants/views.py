from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from .models import Plant
from .forms import PlantForm
from .models import WishlistPlant
from .forms import WishlistPlantForm
import requests
from django.conf import settings
import json



def welcome(request):
    return render(request, 'welcome.html')

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def plant_list(request):
    plants = Plant.objects.filter(user=request.user)

    if request.method == 'POST':
        if 'add' in request.POST:
            add_form = PlantForm(request.POST, request.FILES)
            if add_form.is_valid():
                new_plant = add_form.save(commit=False)
                new_plant.user = request.user
                new_plant.save()
                return redirect('plant_list')

        elif 'edit' in request.POST:
            plant = get_object_or_404(Plant, id=request.POST.get('edit_plant_id'), user=request.user)
            edit_form = PlantForm(request.POST, request.FILES, instance=plant)
            if edit_form.is_valid():
                edit_form.save()
                return redirect('plant_list')

        elif 'delete' in request.POST:
            plant = get_object_or_404(Plant, id=request.POST.get('delete_plant_id'), user=request.user)
            plant.delete()
            return redirect('plant_list')

    else:
        add_form = PlantForm()

    edit_forms = {plant.id: PlantForm(instance=plant) for plant in plants}

    return render(request, 'plants/plant_list.html', {
        'plants': plants,
        'add_form': add_form,
        'edit_forms': edit_forms,
    })

@login_required
@require_GET
def search_plants(request):
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse({'data': []})

    api_key = settings.PERENUAL_API_KEY
    url = f"https://perenual.com/api/v2/species-list?key={api_key}&q={query}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.RequestException as e:
        return JsonResponse({'error': 'Failed to fetch data from Perenual.'}, status=500)
    
@login_required
@require_GET
def plant_details(request, plant_id):
    api_key = settings.PERENUAL_API_KEY
    url = f"https://perenual.com/api/v2/species/details/{plant_id}?key={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.RequestException as e:
        return JsonResponse({'error': 'Failed to fetch plant details.'}, status=500)

@login_required
def wishlist_view(request):
    wishlist = WishlistPlant.objects.filter(user=request.user)

    if request.method == 'POST':
        if 'add' in request.POST:
            add_form = WishlistPlantForm(request.POST)
            if add_form.is_valid():
                new_plant = add_form.save(commit=False)
                new_plant.user = request.user
                new_plant.save()
                return redirect('wishlist')

        elif 'edit' in request.POST:
            plant = get_object_or_404(WishlistPlant, id=request.POST.get('edit_plant_id'), user=request.user)
            edit_form = WishlistPlantForm(request.POST, instance=plant)
            if edit_form.is_valid():
                edit_form.save()
                return redirect('wishlist')

        elif 'delete' in request.POST:
            plant = get_object_or_404(WishlistPlant, id=request.POST.get('delete_plant_id'), user=request.user)
            plant.delete()
            return redirect('wishlist')

    else:
        add_form = WishlistPlantForm()

    edit_forms = {plant.id: WishlistPlantForm(instance=plant) for plant in wishlist}

    return render(request, 'plants/wishlist.html', {
        'wishlist': wishlist,
        'add_form': add_form,
        'edit_forms': edit_forms
    })

@login_required
def add_to_wishlist(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        plant = WishlistPlant.objects.create(
            user=request.user,
            perenual_id=data.get('perenual_id'),
            species=data.get('species'),
            common_name=data.get('common_name'),
            other_names=data.get('other_names'),
            watering=data.get('watering'),
            sunlight=data.get('sunlight'),
            info_summary=data.get('info_summary'),
            image_url=data.get('image_url')
        )
        return JsonResponse({'status': 'success', 'id': plant.id})
    return JsonResponse({'error': 'Invalid method'}, status=405)

@login_required
@require_POST
def delete_from_wishlist(request, plant_id):
    plant = get_object_or_404(WishlistPlant, id=plant_id, user=request.user)
    plant.delete()
    return JsonResponse({'status': 'deleted'})

@login_required
@require_POST
def add_from_wishlist_to_myplants(request):
    data = json.loads(request.body)
    wishlist_id = data.get('wishlist_id')

    # Find the wishlist plant
    wishlist_plant = get_object_or_404(WishlistPlant, id=wishlist_id, user=request.user)

    # Create a new plant entry
    new_plant = Plant.objects.create(
        user=request.user,
        nickname=wishlist_plant.common_name or wishlist_plant.species,
        species=wishlist_plant.species,
        common_name=wishlist_plant.common_name,
        other_names=wishlist_plant.other_names,
        watering=wishlist_plant.watering,
        sunlight=wishlist_plant.sunlight,
        info_summary=wishlist_plant.info_summary,
        water_interval_days=7,
        image_url=wishlist_plant.image_url  # ✅ Store the external image URL
    )

    # Remove from wishlist
    wishlist_plant.delete()

    return JsonResponse({'status': 'added', 'plant_id': new_plant.id})
