from django.conf.urls import url
from Users import views

urlpatterns = [

    url(r'^kullanicilar/$', views.KullaniciData.as_view()),
    url(r'^kullanici_kayit/$', views.KullaniciKayit.as_view()),
    url(r'^sifremi_unuttum/$', views.ForgetPassword.as_view()),
    url(r'^profile/$', views.Profile.as_view()),
    url(r'^get_profile/$', views.GetProfiles.as_view()),
    url(r'^updateProfile/$', views.UpdateProfile.as_view()),
    url(r'^getId/$', views.GetId.as_view()),
    url(r'^getUsers/$', views.GetUsers.as_view()),
    url(r'^deleteUser/$', views.DeleteUser.as_view()),
    url(r'^addBlocks/$', views.AddBlock.as_view()),
    url(r'^myBlocks/$', views.MyBlocks.as_view()),
    url(r'^ignoreBlock/$', views.ignoreBlock.as_view()),
]