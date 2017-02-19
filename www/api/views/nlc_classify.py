import json
import os

from django.http import JsonResponse
from watson_developer_cloud import NaturalLanguageClassifierV1

from api.views.classified import Classified


def GetClassifyQuestions(request, sentences):
    sentences = [sentences]
    natural_language_classifier = NaturalLanguageClassifierV1(
        username=os.environ['watson_username'],
        password=os.environ['watson_password'])
    status = natural_language_classifier.status('f5bbbcx175-nlc-1012')
    result = []
    if status['status'] == 'Available':
        for sentence in sentences:
            classes = natural_language_classifier.classify(
                'f5bbbcx175-nlc-1012', sentence)
            j = json.loads(json.dumps(classes))
            sentence_class = j['classes'][0]
            result.append(Classified(sentence, sentence_class))
    return JsonResponse({'tag': result[0].tag})
