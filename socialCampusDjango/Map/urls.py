from django.conf.urls import url
from Map import views

urlpatterns = [

    url(r'^map/$', views.GetMap.as_view()),

]