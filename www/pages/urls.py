from django.conf.urls import url
from views import GetHomePage, GetTeamPage

urlpatterns = [
    url(r'^team/$', GetTeamPage, name='The Team'),
    url(r'^home/$', GetHomePage, name='The Homepage'),
    url(r'^', GetHomePage, name='The Homepage')
]
