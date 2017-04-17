import json
import os

from django.http import JsonResponse
from watson_developer_cloud import NaturalLanguageClassifierV1

from classified import Classified

# Classifiers IDs
OLD_CID = 'f5bbbcx175-nlc-1012'
BIO_CID = '90e7b4x199-nlc-32429'

"""
Returns with question prompts type. The types can be:

'SA' : Short Answer
'TF' : True False
'MC' : Multiple Choice

None can also be returned if the survice is unavailable.
"""
def get_question_type(prompt, classifier_id=BIO_CID):
    natural_language_classifier = NaturalLanguageClassifierV1(
        username=os.environ['watson_username'],
        password=os.environ['watson_password']
    )
    status = natural_language_classifier.status(classifier_id)
    prompt_type = None
    if status['status'] == 'Available':
        classes = natural_language_classifier.classify(
            classifier_id, prompt)
        j = json.loads(json.dumps(classes))
        prompt_type = j['classes'][0]
    return prompt_type
