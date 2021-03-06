# Generated by Django 2.2.11 on 2020-04-27 22:16

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Users', '0002_kullanicilar_image'),
        ('Subjects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Comment', models.TextField()),
                ('Date', models.DateTimeField(default=datetime.datetime(2020, 4, 28, 1, 16, 25, 243027))),
                ('Like', models.IntegerField(default=0)),
                ('Dislike', models.IntegerField(default=0)),
                ('Kullanici_Id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.Kullanicilar')),
                ('Subject_Id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Subjects.Subjects')),
            ],
        ),
    ]
