# Generated by Django 2.2.11 on 2020-03-18 06:57

import Activities.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activities',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Type', models.CharField(max_length=16, verbose_name='Tür')),
                ('Content', models.TextField(verbose_name='Açıklama')),
                ('Image', models.FileField(null=True, upload_to=Activities.models.Activities.get_upload_path, verbose_name='Resim')),
                ('Address', models.TextField(verbose_name='Adres')),
                ('Price', models.CharField(max_length=16, null=True, verbose_name='Ücret')),
                ('Hour', models.CharField(max_length=16, null=True, verbose_name='Saat')),
                ('Date', models.CharField(max_length=30, verbose_name='Tarih')),
                ('New', models.CharField(max_length=16, verbose_name='deger')),
                ('Kayit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Create_Id', to='Users.Kullanicilar')),
            ],
        ),
    ]
