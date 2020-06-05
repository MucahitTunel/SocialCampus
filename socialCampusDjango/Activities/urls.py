from django.conf.urls import url
from Activities import views


urlpatterns = [
    url(r"^upload/$", views.UploadData.as_view()),
    url(r"^get_data/$", views.GetData.as_view()),
    url(r"^detail/$", views.Detail.as_view()),
    url(r"^deleteActivity/$", views.deleteActivity.as_view()),
    url(r"^myActivities/$", views.MyActivities.as_view()),
]