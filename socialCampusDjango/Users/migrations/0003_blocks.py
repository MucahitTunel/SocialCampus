# Generated by Django 2.2.11 on 2020-05-22 22:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0002_kullanicilar_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Blocks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Block_Id', models.IntegerField(verbose_name='Engellenen id')),
                ('My_Id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.Kullanicilar', verbose_name='Benim id')),
            ],
        ),
    ]