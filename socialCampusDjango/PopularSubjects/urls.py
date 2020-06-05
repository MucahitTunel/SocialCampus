from django.conf.urls import url
from PopularSubjects import views


urlpatterns = [
    url(r"^add_popular_subjects/$", views.AddPopularSubjects.as_view()),
]