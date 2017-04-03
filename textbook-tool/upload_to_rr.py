import os
from watson_developer_cloud import RetrieveAndRankV1
import requests
import json

headers = {
    'Content-Type': 'application/json',
}

USERNAME = os.environ['watson_rr_username']
PASSWORD = os.environ['watson_rr_password']
CLUSTERID = os.environ['watson_rr_cluster_id']
COLL_NAME = 'bio-collection'

retrieve_and_rank = RetrieveAndRankV1(
     username=USERNAME,
     password=PASSWORD)

# Run these two lines to list the configs in the cluster
# configs = retrieve_and_rank.list_configs(solr_cluster_id=CLUSTERID)
# print(json.dumps(configs, indent=2))

#collection = retrieve_and_rank.create_collection(CLUSTERID, COLL_NAME, 'example_config')

# Run these two lines to list the collections in the cluster
# collections = retrieve_and_rank.list_collections(solr_cluster_id=CLUSTERID)
# print(json.dumps(collections, indent=2))

# Used to upload documents to a collection
# data = open('./biology.json', 'rb').read()
# print data
# print requests.post(
#     'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/{0}/solr/bio-collection/update'.format(CLUSTERID),
#      headers=headers, data=data, auth=(USERNAME, PASSWORD)).json()

pysolr_client = retrieve_and_rank.get_pysolr_client(CLUSTERID, 'bio-collection')
results = pysolr_client.search('blue-green algae')
#print results.docs
for doc in results.docs:
    print doc
