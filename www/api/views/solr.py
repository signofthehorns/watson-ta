# create a psuedo-python api for retrieve (solr) part of retrieve and rank
import json
import os, sys
import requests
import re
from django.http import JsonResponse
from watson_developer_cloud import RetrieveAndRankV1

def list_clusters(request):
  retrieve_and_rank = RetrieveAndRankV1(
    username=os.environ['watson_rr_username'],
    password=os.environ['watson_rr_password']
  )
  return JsonResponse(retrieve_and_rank.list_solr_clusters())

def list_collections(request, cluster_id):
  retrieve_and_rank = RetrieveAndRankV1(
    username=os.environ['watson_rr_username'],
    password=os.environ['watson_rr_password']
  )
  return JsonResponse(retrieve_and_rank.list_collections(solr_cluster_id=cluster_id))

def list_configs(request, cluster_id):
  retrieve_and_rank = RetrieveAndRankV1(
    username=os.environ['watson_rr_username'],
    password=os.environ['watson_rr_password']
  )
  return JsonResponse(retrieve_and_rank.list_configs(solr_cluster_id=cluster_id))

def list_rankers(request, cluster_id):
  retrieve_and_rank = RetrieveAndRankV1(
    username=os.environ['watson_rr_username'],
    password=os.environ['watson_rr_password']
  )
  return JsonResponse(retrieve_and_rank.list_rankers())