from django.conf.urls import url
from Subjects import views

urlpatterns = [

    url(r'^subjects/$', views.GetSubjectData.as_view()),
    url(r'^uploadSubject/$', views.UploadSubjectData.as_view()),
    url(r'^search/$', views.SearchData.as_view()),
    url(r'^mySubjects/$', views.getMySubjects.as_view()),
    url(r'^deleteSubject/$', views.DeleteSubjects.as_view()),

]