from django.conf.urls import url
from . import views

# specify regexs for url matching
urlpatterns = [
  url(r'^$', views.index, name='index')
]
