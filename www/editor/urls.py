from django.conf.urls import url
from editor.views import index

urlpatterns = [
    url(r'^$',
        index, name='Editor Index'),
]
