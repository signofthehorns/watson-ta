import json
import os

from django.http import JsonResponse
from watson_developer_cloud import NaturalLanguageClassifierV1

from classified import Classified

def GetClassifyQuestion(request, sentence):
    natural_language_classifier = NaturalLanguageClassifierV1(
        username=os.environ['watson_username'],
        password=os.environ['watson_password']
    )
    status = natural_language_classifier.status('f5bbbcx175-nlc-1012')
    result = ""
    if status['status'] == 'Available':
        classes = natural_language_classifier.classify(
            'f5bbbcx175-nlc-1012', sentence)
        j = json.loads(json.dumps(classes))
        sentence_class = j['classes'][0]
        result = Classified(sentence, sentence_class).tag
    return JsonResponse({'tag': result})
