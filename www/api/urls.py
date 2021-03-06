from django.conf.urls import url
from views import alchemy, nlc_classify, upload_questions, rr_search, solr, user_menu

urlpatterns = [
    url(r'^alchemy/(?P<sentence>.{0,350})/$',
        alchemy.GetAlchemyRequest, name='Get Alchemy Info'),
    url(r'^upload/questions/(?P<classifier_id>.{0,30})$', upload_questions.upload_questions_file, name='Upload Questions'),
    url(r'^rr_search/(?P<query>.{0,350})/(?P<collection>.{0,350})/(?P<ranker_id>.{0,350})/$',
        rr_search.GetRRSearchWithRanking, name='Get RR Search with Ranking'),
    url(r'^rr_search/(?P<query>.{0,350})/(?P<collection>.{0,350})/$',
        rr_search.GetRRSearch, name='Get RR Search'),
    url(r'^list_clusters/$',solr.list_clusters, name='List Solr Clusters'),
    url(r'^list_collections/(?P<cluster_id>.{0,350})$',solr.list_collections, name='List Solr Collections'),
    url(r'^list_configs/(?P<cluster_id>.{0,350})$',solr.list_configs, name='List Solr Configurations'),
    url(r'^list_rankers/(?P<cluster_id>.{0,350})$',solr.list_rankers, name='List Solr Rankers'),
    url(r'^user_menu/$', user_menu.GetUserMenuRequest, name="Get User Menu Data"),
]
