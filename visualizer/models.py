from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Animation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    animations = models.TextField(blank=True)
