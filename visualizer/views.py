from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.template import RequestContext
from json import dumps
from .forms import SerializedForm
from django.core import serializers
from .models import Animation
from django.contrib.auth.models import User



# Create your views here.
def visualizer(request):
    animationData = [];
    if request.user.is_authenticated:
        animationData = serializers.serialize("json", Animation.objects.filter(user=request.user))
    return render(request,'visualizer.html',{'databaseAnimations':animationData});

def register(request):
    if request.method == "GET":
        return render(
            request, "register.html",
            {"form": UserCreationForm}
        )
    elif request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("visualizer")
        else:
            return render(
                request, "register.html",
                {"form": UserCreationForm}
            )

def saveSerialized(request):
    if request.is_ajax and request.method == 'POST':
        form = SerializedForm(request.POST);
        if form.is_valid():
            u = User.objects.get(pk = request.user.pk);
            a = request.POST.__getitem__('serialized');
            dbAnimation = Animation(user=u,animations=a)
            dbAnimation.save();
            animationData = serializers.serialize('json',Animation.objects.filter(user=u))
            return JsonResponse({'databaseAnimations':animationData}, status=200)

        else:
            return JsonResponse({"error": form.errors}, status=400)

    return JsonResponse({"error": form.errors}, status=400)
