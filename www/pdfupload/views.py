from django.shortcuts import render
from django.http import HttpResponse
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

# Working on doing async requests...
def index(request):
  template = loader.get_template('pdfupload/index.html')

  test_questions = [
    'Name three types of dogs.',
    'What is a television?',
    'List the different themes present in Homers The Iliad.',
    'How can we eliminate disease from the human genome?',
    'Can cancer be cured?',
    'I am a human.',
    'Shapes have 4 90 degree angles.',
    'A triangle by definition has 3 or more sides.',
    'The internal temperature of the suns core is greater than 1 trillion degrees celsius',
    'Humans are descended from chimpanzees.',
    'Small dogs live longer than older dogs.',
    'Karen can tell if it is currently raining.',
    'Excel can tell the difference between numbers and letters.',
    'Bobo the gorilla can list the letters of the alphabet.',
    'Jackon Pollock revolutionized art with photo-realistic paintings.',
    'The assembly line made cars widely available and affordable.',
    'George Washington said "Can I cut down this tree?"',
    'The girls asked "What is a television?"',
    'Describe how the assembly line made cars widely available and affordable.',
    'Which of the following are related to space? a. saucers b. Mars c. dirt',
    'Select the most correct sentence. A) Lizards are primates. B) Science is subjective. C) Science rules.',
    'How many people live in SF California? 1) 2000 2) 20000 3) 200000 4) 2000000 5) 20000000',
    'Which type of grass is most commonly found in Ohio? 1 Blue grass 2 alfalfa 3 green grass.',
    'What is the solution to 0=x-1? 1. x=1 2. x=2 3. x=3.'
  ]
  results = classify_questions(test_questions)
  context = {
    'classifications' : results  
  }

  return HttpResponse(template.render(context,request))