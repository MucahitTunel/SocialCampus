# Generated by Django 2.2.11 on 2020-04-08 19:36

import Users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='kullanicilar',
            name='Image',
            field=models.FileField(null=True, upload_to=Users.models.Kullanicilar.get_upload_path, verbose_name='Resim'),
        ),
    ]