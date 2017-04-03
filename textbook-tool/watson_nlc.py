import os
import sys
import json
import time
from watson_developer_cloud import NaturalLanguageClassifierV1

def get_nlc_instance():
    return NaturalLanguageClassifierV1(
        username=os.environ['watson_nlc_tt_username'],
        password=os.environ['watson_nlc_tt_password'])

def train(filename, classifier_name, nlc=None):
    if nlc == None:
        nlc = get_nlc_instance()

    if find_classifier_by_name(classifier_name, nlc) == None:
        with open(filename, 'rb') as training_data:
          classifier = nlc.create(
            training_data=training_data,
            name=classifier_name,
            language='en' # Added as an assumption
          )
        #print(json.dumps(classifier, indent=2))
        return classifier['classifier_id']
    else:
        print 'This classifier already exists. Check its status with is_available().'
        return None

def get_classifiers(nlc=None):
    if nlc == None:
        nlc = get_nlc_instance()
    return nlc.list()

def find_classifier_by_name(classifier_name, nlc=None):
    if nlc == None:
        nlc = get_nlc_instance()
    classifiers = get_classifiers(nlc)
    for c in classifiers['classifiers']:
        if c['name'] == classifier_name:
            return c
    return None

def is_available(classifier_id, nlc=None):
    if nlc == None:
        nlc = get_nlc_instance()
    return nlc.status(classifier_id)['status'] == 'Available'

def wait_for_available(classifier_id, nlc=None):
    if nlc == None:
        nlc = get_nlc_instance()

    while not is_available(classifier_id, nlc):
        time.sleep(60)  # Delay for 1 minute (60 seconds)

def classify(classifier_id, query, nlc=None):
    if nlc == None:
        nlc = get_nlc_instance()

    classes = nlc.classify(classifier_id, query)
    return classes['top_class']

if __name__ == '__main__':
    def print_arg_error():
        print('Invalid invocation: Wrong # of arguments.')
        print('How to run the program:\n\t>python {0} path/to/my-training-data.csv name-of-nlc-classifier'.format(__file__))

    if len(sys.argv) != 3:
        print_arg_error()
    else:
        training_data_file = sys.argv[1]
        classifier_name = sys.argv[2]
        train(training_data_file, classifier_name)
