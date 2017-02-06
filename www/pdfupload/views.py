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
  print >>sys.stderr, qs
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

def index(request):
  template = loader.get_template('pdfupload/index.html')
  test_questions = [
    'Can cancer be cured?',
    'I am a human.',
  ]
  results = classify_questions(test_questions)
  context = {
    'classifications' : results  
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

def handle_uploaded_file(f):
  return convert_pdf_to_txt(f)

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
