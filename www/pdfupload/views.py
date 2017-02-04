from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader

from watson_developer_cloud import NaturalLanguageClassifierV1
import os,sys
import json

class Classified(object):
  def __init__(self, question_, class_):
    self.question = question_
    self.tag,self.conf = class_['class_name'],class_['confidence']

def classify_questions(qs):
  natural_language_classifier = NaturalLanguageClassifierV1(
    username=os.environ['watson_username'],
    password=os.environ['watson_password'])
  status = natural_language_classifier.status('f5bbbcx175-nlc-1012')
  result = []
  if status['status'] == 'Available':
    for q in qs:
      classes = natural_language_classifier.classify('f5bbbcx175-nlc-1012', q)
      j = json.loads(json.dumps(classes))
      qclass = j['classes'][0]
      result.append(Classified(q,qclass))
  return result

def classify(request,sentence):
  res = classify_questions([sentence])
  return JsonResponse({'tag': res[0].tag})

# Working on doing async requests...
def index(request):
  template = loader.get_template('pdfupload/index.html')
  test_questions = []
  results = classify_questions(test_questions)
  context = {
    'classifications' : results  
  }
  return HttpResponse(template.render(context,request))