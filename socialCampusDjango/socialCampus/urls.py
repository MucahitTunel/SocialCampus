"""socialCampus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url('admin/', admin.site.urls),
    url(r'^Kullanicilar/', include('Users.urls')),
    url(r'^Activities/', include('Activities.urls')),
    url(r'^Subjects/', include('Subjects.urls')),
    url(r'^Comments/', include('Comments.urls')),
    url(r'^PopularComments/', include('PopularComments.urls')),
    url(r'^Map/', include('Map.urls')),
    url(r'^Popularsubjects/', include('PopularSubjects.urls')),
    url(r'^Market/', include('Market.urls')),
    url(r'^Fpgrowth/', include('Fpgrowth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
