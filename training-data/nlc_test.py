import json
# from os.path import join, dirname
from watson_developer_cloud import NaturalLanguageClassifierV1
import os

natural_language_classifier = NaturalLanguageClassifierV1(
    username=os.environ["watson_username"],
    password=os.environ["watson_password"])

classifiers = natural_language_classifier.list()
#classifiers = natural_language_classifier.remove('f5b432x172-nlc-2382')
print(json.dumps(classifiers, indent=2))

# create a classifier
'''with open('train-questions.csv', 'rb') as training_data:
     print(json.dumps(natural_language_classifier.create(
 training_data=training_data, name='87questions'), indent=2))'''

# replace f5bbbcx175-nlc-1012 with your classifier id
status = natural_language_classifier.status('f5bbbbx174-nlc-3547')
print(json.dumps(status, indent=2))

test_questions = []
correct = 0
total = 24.0

if status['status'] == 'Available':
    with open('test_questions.csv', 'r') as test_data:
        for line in test_data:
            line = line.split('\n')[0]
            question_answer = line.split(',')
            #print question_answer
            test_questions.append({'q':question_answer[0], 'c':question_answer[1]})

    for qa in test_questions:
        classes = natural_language_classifier.classify('f5bbbbx174-nlc-3547', qa['q'])
        j = json.loads(json.dumps(classes))
        #print j['classes']
        if j['classes'][0]['class_name'] == qa['c']:
            correct += 1
        else:
			print j['classes']
			print qa['q']
			print qa['c']
        #print(json.dumps(classes, indent=2))
print 'Accuracy: ' + str(100 * (correct / total))

# delete = natural_language_classifier.remove('f5bbbcx175-nlc-1012')
# print(json.dumps(delete, indent=2))

# example of raising a WatsonException
# print(json.dumps(
#     natural_language_classifier.create(training_data='', name='weather3'),
#     indent=2))
