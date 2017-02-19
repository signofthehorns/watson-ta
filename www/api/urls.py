from django.conf.urls import url
from api.views import alchemy, nlc_classify, upload

urlpatterns = [
    url(r'^alchemy/(?P<sentence>.{0,350})/$',
        alchemy.GetAlchemyRequest, name='Get Alchemy Info'),
    url(r'^nlc/(?P<sentence>.{0,350})/$',
        nlc_classify.GetClassifyQuestion, name='Get NLC Classify'),
    url(r'^upload/$', upload.upload_file, name='Upload'),
]
