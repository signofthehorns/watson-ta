from django.conf.urls import url
from . import views

# specify regexs for url matching
urlpatterns = [
    url(r'^home/$', views.home, name='home'),
    url(r'^team/$', views.team, name='team'),
    url(r'^$', views.index, name='default'),
]
