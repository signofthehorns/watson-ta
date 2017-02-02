import json
# from os.path import join, dirname
from watson_developer_cloud import NaturalLanguageClassifierV1

natural_language_classifier = NaturalLanguageClassifierV1(
    username='340e5b17-e07e-419f-96fa-ff1faa31f79f',
    password='q0m53y343fMn')

classifiers = natural_language_classifier.list()
print(json.dumps(classifiers, indent=2))

# create a classifier
# with open('train-questions.csv', 'rb') as training_data:
#     print(json.dumps(natural_language_classifier.create(
# training_data=training_data, name='questions'), indent=2))

# replace f5bbbcx175-nlc-1012 with your classifier id
status = natural_language_classifier.status('f5bbbcx175-nlc-1012')
print(json.dumps(status, indent=2))

test_questions = []
correct = 0
total = 15.0

if status['status'] == 'Available':
    with open('test_questions.csv', 'r') as test_data:
        for line in test_data:
            line = line.split('\n')[0]
            question_answer = line.split(',')
            print question_answer
            test_questions.append({'q':question_answer[0], 'c':question_answer[1]})

    for qa in test_questions:
        classes = natural_language_classifier.classify('f5bbbcx175-nlc-1012', qa['q'])
        j = json.loads(json.dumps(classes))
        print j['classes']
        if j['classes'][0]['class_name'] == qa['c']:
            correct += 1
        #print(json.dumps(classes, indent=2))
print 'Accuracy: ' + str(100 * (correct / total))

# delete = natural_language_classifier.remove('f5bbbcx175-nlc-1012')
# print(json.dumps(delete, indent=2))

# example of raising a WatsonException
# print(json.dumps(
#     natural_language_classifier.create(training_data='', name='weather3'),
#     indent=2))
