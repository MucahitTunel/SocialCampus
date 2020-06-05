from django.conf.urls import url
from Market import views


urlpatterns = [
    url(r"^upload/$", views.UploadMarket.as_view()),
    url(r"^getMarket/$", views.getMarket.as_view()),
    url(r"^detail/$", views.Detail.as_view()),
    url(r"^getMyMarket/$", views.MyMarket.as_view()),
    url(r"^editMarket/$", views.editMarket.as_view()),
    url(r"^editUploadMarket/$", views.EditUploadMarket.as_view()),
    url(r"^deleteMarket/$", views.deleteMarket.as_view()),
    url(r"^getfilter/$", views.getFilterMarket.as_view()),
    url(r"^favorites/$", views.Like.as_view()),
    url(r"^getmyfav/$", views.MyFavMarket.as_view()),

]