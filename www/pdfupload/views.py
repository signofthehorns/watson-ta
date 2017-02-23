from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader

from watson_developer_cloud import NaturalLanguageClassifierV1
from watson_developer_cloud import AlchemyLanguageV1
import os,sys
import json
import requests

class Classified(object):
  def __init__(self, question_, class_=None):
    self.question = question_
    if class_ is not None:
      self.tag,self.conf = class_['class_name'],class_['confidence']
    self.words = [
      {'fragment':self.question, 'tag': None}
    ]

  def get_map_repr(self):
    return {
      'tag': self.tag,
      'text': self.question
    }

  def set_fragmented_text(self, text, indices, tags):
    if len(indices) == 0:
      return
    # sort tags in order for easier processing
    indices,tags = zip(*sorted(zip(indices, tags)))
    self.words = []
    current_index = 0
    for i,p in enumerate(indices):
      start,end = p
      before = text[current_index:start]
      kw = text[start:end]
      self.words.append({'fragment': before, 'tag': None})
      self.words.append({'fragment': kw, 'tag': tags[i]},)
      current_index = end+1
    if current_index < len(text):
      self.words.append({'fragment': text[current_index:], 'tag': None})

  def set_entities(self):
    # TODO if question is more than one sentence split into
    # individual calls
    alchemy_language = AlchemyLanguageV1(api_key=os.environ['watson_alchemy_key'])
    query = alchemy_language.combined(
        text=self.question,
        extract='keywords,concepts',
        sentiment=1,
        max_items=15)
    # self.entities = query['entities']
    self.keywords = query['keywords']
    self.concepts = query['concepts']

    indices = []
    tags = []
    for k in self.keywords:
      text = k['text']
      sentiment = k['sentiment']['type']
      start = self.question.index(text)
      indices.append((start,start+len(text)))
      tags.append('entity-'+sentiment)
    # find range 
    self.set_fragmented_text(self.question, indices, tags)

def classify_questions(qs):
  natural_language_classifier = NaturalLanguageClassifierV1(
    username=os.environ['watson_username'],
    password=os.environ['watson_password'])
  status = natural_language_classifier.status('f5bbbbx174-nlc-3547')
  result = []
  if status['status'] == 'Available':
    for q in qs:
      classes = natural_language_classifier.classify('f5bbbbx174-nlc-3547', q)
      j = json.loads(json.dumps(classes))
      qclass = j['classes'][0]
      result.append(Classified(q,qclass))
  return result

def alchemify(request,sentence):
  cs = Classified(sentence)
  cs.set_entities()
  return JsonResponse(
      {
        'words' : cs.words,
        'keywords' : cs.keywords,
        'concepts' : cs.concepts,
      }
    )

def classify(request,sentence):
  res = classify_questions([sentence])
  return JsonResponse({'tag': res[0].tag})

def index(request):
  template = loader.get_template('pdfupload/index.html')
  test_questions = [
    'what is the water cycle',
    'please explain why Jimmy Fallon always seems to be fake laughing',
    'what is your favorite flavor of ice cream',
  ]
  results = classify_questions(test_questions)
  context = {
    'classifications' : results,
  }
  return HttpResponse(template.render(context,request))


# ------------------------------------------------------------------------
#  Handle PDF Upload and return the text from the document
# ------------------------------------------------------------------------
# for file upload
from django import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from cStringIO import StringIO
import re

def convert_pdf_to_txt(fp):
  rsrcmgr = PDFResourceManager()
  retstr = StringIO()
  codec = 'utf-8'
  laparams = LAParams()
  device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
  interpreter = PDFPageInterpreter(rsrcmgr, device)
  password = ""
  maxpages = 0
  caching = True
  pagenos=set()
  for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
      interpreter.process_page(page)
  text = retstr.getvalue()
  fp.close()
  device.close()
  retstr.close()
  return text

class UploadFileForm(forms.Form):
    file = forms.FileField()

def extract_questions(text):
  text = text.replace('\t',' ')
  pattern = '[0-9]+(\)|\.)(?:(?![0-9]+(\)|\.)).)*'
  m = re.finditer(pattern, text)
  res = [match.group(0) for match in m]

  obj_res = []
  for r in res:
    rmap = {
      'class_name': 'TF',
      'confidence': 0.0
    }
    # todo get classified result
    obj_res.append(Classified(r,rmap).get_map_repr()) 
  # order questions and classify
  return obj_res

def handle_uploaded_file(f):
  text = convert_pdf_to_txt(f)
  questions = extract_questions(text)
  return questions

# LOL, using this decorator because of laziness right
# now. in the future we will want to securely send 
# files
@csrf_exempt
def upload_file(request):
  if request.method == 'POST':
    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
      text = handle_uploaded_file(request.FILES['file'])
      return JsonResponse({
        'success': True,
        'text': text
      })
  return JsonResponse({'success': False})


# -----------------------------------------------------------------------------
# Home page for watson ta
def home(request):
  template = loader.get_template('pdfupload/home.html')
  context = {
  }
  return HttpResponse(template.render(context,request))


# -----------------------------------------------------------------------------
# Team page
import github3

def get_team_data():
  gh = github3.login(os.environ['github_username'],os.environ['github_password'])
  repo = gh.repository('signofthehorns','watson-ta')
  team_members = []
  for u in repo.contributors():
    user = gh.user(u)
    data = {
      'name': user.name,
      'avatar_url': user.avatar_url,
      'location': user.bio,
      'username': u
    }
    team_members.append(data)
  return team_members

# Team Info Page
def team(request):
  template = loader.get_template('pdfupload/team.html')
  team_data = get_team_data()
  context = {
    'data': team_data
  }
  return HttpResponse(template.render(context,request))

# ----------------------------------------
# Retrieve and Rank Code
# -----------------------------------------

# This code could probably be cleaned up
# returns a list of text chunks with their 
# corresponding css tags.
def highlight_query(body,query):
  m = re.finditer(query, body, re.IGNORECASE)
  res = [match for match in m]
  if len(res)>0:
    chunks = []
    indices = []
    lengths = []
    for match in res:
      indices.append(match.start())
      lengths.append(len(match.group(0)))
    indices,lengths = zip(*sorted(zip(indices, lengths)))
    for i in reversed(range(len(indices))):
      index,length = indices[i],lengths[i]
      chunks.append({'fragment': body[index+length:], 'tag': None})
      chunks.append({'fragment': body[index:index+length], 'tag': 'mark'})
      body = body[:index]
    chunks.append({'fragment': body, 'tag': None})
    return chunks[::-1]
  return [{'fragment': body, 'tag': None}]

def format_result_body(body, query):
  MAX_BODY_LENGTH = 500 #so the search results don't get overcrowded
  m = re.finditer(query, body, re.IGNORECASE)
  res = [match for match in m]
  formatted_body = body
  if len(res) > 0 and len(body)-len(query)>MAX_BODY_LENGTH:
    start_index = max(0,res[0].start()-MAX_BODY_LENGTH//2)
    end_index = max(res[0].start()+MAX_BODY_LENGTH//2,res[0].start()+MAX_BODY_LENGTH-start_index)
    # print(start_index,end_index)
    formatted_body = body[start_index:end_index]
  else:
    formatted_body = body[:MAX_BODY_LENGTH]
  return highlight_query(formatted_body,query)

# TODO: if we have time we should make sure we are safely sending through user queries
# aka preventing sql injection, csrf... idk if django automatically does that.
def rr_search(request,query):
  url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc8a9f0ce9_ff50_484d_9c5d_9e6ceafe1ccf/solr/hp_collection/select?q=' + query + '&wt=json&fl=id,title,body'

  headers = {
    'Content-Type': 'application/json',
  }
  username = os.environ['watson_rr_username']
  password = os.environ['watson_rr_password']
  res = requests.post(url, headers=headers, auth=(username, password))

  search_results = {
    'docs' : []
  }
  res_json = res.json()
  for document in res_json['response']['docs']:
    # potentially format text here
    d = {
      'body': format_result_body(document['body'][0], query),
      'title': document['title'][0],
    }
    search_results['docs'].append(d)
  return JsonResponse(search_results)

