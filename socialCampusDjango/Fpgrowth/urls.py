from django.conf.urls import url
from Fpgrowth import views


urlpatterns = [
    url(r"^add/$", views.AddData.as_view()),

]