from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_default_shelves(sender, instance, created, **kwargs):
    if created:
        from shelves.models import Shelf
        default_shelves = ['Currently Reading', 'Want to Read', 'Completed']
        for shelf_name in default_shelves:
            Shelf.objects.get_or_create(user=instance, name=shelf_name, defaults={'is_default': True})

        if not instance.display_name:
            full_name = f"{instance.first_name} {instance.last_name}".strip()
            instance.display_name = full_name or instance.username
            instance.save(update_fields=['display_name'])

