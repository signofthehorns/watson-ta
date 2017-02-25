# create a psuedo-python api for retrieve (solr) part of retrieve and rank
import json
import os, sys
import requests
import re
from django.http import JsonResponse

def list_clusters(request):
  url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters'
  username = os.environ['watson_rr_username']
  password = os.environ['watson_rr_password']
  res = requests.get(url, auth=(username, password))
  return JsonResponse(res.json())

def list_collections(request, cluster_id):
  url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/' + \
    cluster_id + '/solr/admin/collections/?action=LIST&wt=json'

  headers = {
    'Content-Type': 'application/json',
  }
  username = os.environ['watson_rr_username']
  password = os.environ['watson_rr_password']
  res = requests.post(url, headers=headers, auth=(username, password))
  return JsonResponse({'collections': res.json()['collections']})

def list_configs(request, cluster_id):
  url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/' + cluster_id + '/config'
  username = os.environ['watson_rr_username']
  password = os.environ['watson_rr_password']
  print >> sys.stderr, url
  res = requests.get(url, auth=(username, password))
  return JsonResponse({'configs': res.json()['solr_configs']})

def list_rankers(request, cluster_id):
  url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/rankers'
  username = os.environ['watson_rr_username']
  password = os.environ['watson_rr_password']
  res = requests.get(url, headers=headers, auth=(username, password))
  return JsonResponse({'rankers': res.json()['rankers']})