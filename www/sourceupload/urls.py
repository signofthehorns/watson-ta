from django.conf.urls import url
from sourceupload.views import index

# specify regexs for url matching
urlpatterns = [
    url(r'^$', index, name='Source Index'),
]
