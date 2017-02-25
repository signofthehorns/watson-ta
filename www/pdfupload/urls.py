from django.conf.urls import url
from pdfupload.views import index

# specify regexs for url matching
urlpatterns = [
    url(r'^$', index, name='default'),
]
