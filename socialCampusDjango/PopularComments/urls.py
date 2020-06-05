from django.conf.urls import url
from PopularComments import views


urlpatterns = [
    url(r"^add_popular_comments/$", views.AddPopularComments.as_view()),

]