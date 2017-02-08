from django.conf.urls import url
from . import views

# specify regexs for url matching
urlpatterns = [
  url(r'^classify/(?P<sentence>.{0,150})/$', views.classify, name='classify'),
  url(r'^upload/$', views.upload_file, name='upload'),
  url(r'^home/$', views.home, name='home'),
  url(r'^pdfupload/$', views.index, name='index'),
  url(r'^team/$', views.team, name='team'),
  url(r'/^$', views.home, name='default')
]