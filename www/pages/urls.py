from django.conf.urls import url
from pages.views import GetHomePage, GetTeamPage

urlpatterns = [
    url(r'^team/$', GetTeamPage, name='The Team'),
    url(r'^home/$', GetHomePage, name='Editor Index'),
]
