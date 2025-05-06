from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Plant
from .forms import PlantForm


def welcome(request):
    return render(request, 'welcome.html')

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # or your desired post-signup page
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