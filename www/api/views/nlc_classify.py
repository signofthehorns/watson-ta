import json
import os

from django.http import JsonResponse
from watson_developer_cloud import NaturalLanguageClassifierV1

from classified import Classified

# Classifiers IDs
OLD_CID = 'f5bbbcx175-nlc-1012'
BIO_CID = '90e7b4x199-nlc-32429'

# Final NLC classifier, includes all data from:
#   1. Original, handwritten set
#   2. Harry Potter questions
#   3. Two biology homeworks
HORNS_CID = '90e7b4x199-nlc-39319'

# This is the textbook-tool's classifier. This is a separate NLC isinstance
# from the other NLC classifiers, and you need to have the correct credentials
# to have access to it.
BIO_TT_CID = '90e7b7x198-nlc-4690'

"""
Returns with question prompts type. The types can be:

'SA' : Short Answer
'TF' : True False
'MC' : Multiple Choice

None can also be returned if the service is unavailable.
"""
def get_question_type(prompt, classifier_id=HORNS_CID):
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


"""
Returns with line of textbook text's type. The types can be:

'content' : content that should be placed into RR as a retrievable document
'junk'    : useless text that won't help in completing a homework
'qa'      : text that is probably a question on a homework, or an answer option
            to a question

None can also be returned if the service is unavailable.
"""
def get_textbook_text_type(text, classifier_id=BIO_TT_CID):
    # NOTE: Different credentials from above
    natural_language_classifier = NaturalLanguageClassifierV1(
        username=os.environ['watson_nlc_tt_username'],
        password=os.environ['watson_nlc_tt_password']
    )
    status = natural_language_classifier.status(classifier_id)
    text_type = None
    if status['status'] == 'Available':
        classes = natural_language_classifier.classify(
            classifier_id, text)
        j = json.loads(json.dumps(classes))
        text_type = j['classes'][0]
    return text_type
