from django.conf.urls import url
from . import views

# specify regexs for url matching
urlpatterns = [
  url(r'^classify/(?P<sentence>.{0,150})/$', views.classify, name='classify'),
  url(r'^upload/$', views.upload_file, name='upload'),
  url(r'^$', views.index, name='index')
]