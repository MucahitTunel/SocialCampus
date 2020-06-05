from django.conf.urls import url
from Comments import views


urlpatterns = [
    url(r"^comment/$", views.GetComments.as_view()),
    url(r"^add_comment/$", views.AddComments.as_view()),
]