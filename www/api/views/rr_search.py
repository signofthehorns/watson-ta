import json
import os,sys

import requests
import re
from django.http import JsonResponse

from classified import Classified


# ----------------------------------------
# Retrieve and Rank Code
# -----------------------------------------

# This code could probably be cleaned up
# returns a list of text chunks with their
# corresponding css tags.

def highlight_query(body, query):
    m = re.finditer(query, body, re.IGNORECASE)
    res = [match for match in m]
    if len(res) > 0:
        chunks = []
        indices = []
        lengths = []
        for match in res:
            indices.append(match.start())
            lengths.append(len(match.group(0)))
        indices, lengths = zip(*sorted(zip(indices, lengths)))
        for i in reversed(range(len(indices))):
            index, length = indices[i], lengths[i]
            chunks.append({'fragment': body[index + length:], 'tag': None})
            chunks.append(
                {'fragment': body[index:index + length], 'tag': 'mark'})
            body = body[:index]
        chunks.append({'fragment': body, 'tag': None})
        return chunks[::-1]
    return [{'fragment': body, 'tag': None}]

def format_result_body(body, query):
    MAX_BODY_LENGTH = 500  # so the search results don't get overcrowded
    m = re.finditer(query, body, re.IGNORECASE)
    res = [match for match in m]
    formatted_body = body
    if len(res) > 0 and len(body) - len(query) > MAX_BODY_LENGTH:
        start_index = max(0, res[0].start() - MAX_BODY_LENGTH // 2)
        end_index = max(res[0].start() + MAX_BODY_LENGTH //
                        2, res[0].start() + MAX_BODY_LENGTH - start_index)
        formatted_body = body[start_index:end_index]
        if start_index > 0:
            formatted_body = '...' + formatted_body
        if end_index < len(body) - 1:
            formatted_body = formatted_body + '...'
    else:
        formatted_body = body[:MAX_BODY_LENGTH]
    return highlight_query(formatted_body, query)

# TODO: maybe clean up using watson python api (if possible)
# TODO: if we have time we should make sure we are safely sending through user queries
# aka preventing sql injection, csrf... idk if django automatically does that.
def execute_query(collection, query):
    cluster_id = os.environ['watson_rr_cluster_id']
    url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/' + \
        cluster_id + '/solr/' + collection + '/select?q=' + \
        query + '&wt=json&fl=id,title,body'
    headers = {
        'Content-Type': 'application/json',
    }
    username = os.environ['watson_rr_username']
    password = os.environ['watson_rr_password']
    res = requests.post(url, headers=headers, auth=(username, password))
    return res.json()

# aka preventing sql injection, csrf... idk if django automatically does that.
def execute_query_with_ranking(collection, query, ranker_id):
    cluster_id = os.environ['watson_rr_cluster_id']
    url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/' + \
        cluster_id + '/solr/' + collection + '/fcselect?ranker_id=' + ranker_id + '&q=' + \
        query + '&wt=json'
    headers = {
        'Content-Type': 'application/json',
    }
    username = os.environ['watson_rr_username']
    password = os.environ['watson_rr_password']
    res = requests.post(url, headers=headers, auth=(username, password))
    return res.json()

def GetRRSearchWithRanking(request, query, collection, ranker_id):
    res = execute_query_with_ranking(collection, query, ranker_id)
    search_results = {
        'docs': []
    }
    for document in res['response']['docs']:
        # potentially format text here
        d = {
            'body': format_result_body(document['body'][0], query),
            'title': document['title'][0],
            'confidence': document['ranker.confidence'],
        }
        search_results['docs'].append(d)
    return JsonResponse(search_results)

def GetRRSearch(request,query,collection):
    res = execute_query(collection, query)
    search_results = {
        'docs': []
    }
    for document in res['response']['docs']:
        # potentially format text here
        d = {
            'body': format_result_body(document['body'][0], query),
            'title': document['title'][0],
        }
        search_results['docs'].append(d)
    return JsonResponse(search_results)
