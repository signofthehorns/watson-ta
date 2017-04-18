import watson_nlc
import json

supported_services = ['nlc']

def separator():
    print '\n---------------------------'

def command_prompt():
    print 'Type help to see commands.'

def print_commands():
    separator()
    print 'List of commands:'
    print '\tservices - lists all supported Watson services under your credentials'
    print '\tservice <service-name> - enters the chosen Watson service'
    print '\texit - ends the interactive Watson session'

def print_nlc_commands():
    separator()
    print 'List of NLC commands:'
    print '\tlist - list all the classifiers under your credentials'
    print '\tcreate <classifier-name> <training-file> - creates a new classifier with the chosen name and the chosen data'
    print '\tdelete <classifier-name> - deletes the specified classifier'
    print '\tinfo <classifier-name> - logs all available information about the chosen classifier'
    print '\tback - go back to the top level prompt'

def print_services():
    separator()
    print 'Available services:'
    for service in supported_services:
        print '\t' + service

def print_goodbye():
    print 'Goodbye!'

def nlc_session():
    print_nlc_commands()
    while True:
        c = raw_input('[nlc]> ')
        if c == 'list':
            response = watson_nlc.get_classifiers()
            #print(json.dumps(watson_nlc.get_classifiers(), indent=2))
            for classifier in response['classifiers']:
                print classifier['name']
                print classifier['classifier_id']
                print classifier['created'] + '\n'
        elif c == 'back':
            break
        elif c == 'help':
            print_nlc_commands()
        else:
            parts = c.split()
            if len(parts) == 3 and parts[0] == 'create': # must be create
                response = watson_nlc.train(parts[2], parts[1])
                if response == None:
                    print 'Could not create the classifier.'
                else:
                    print 'New classifier ' + parts[1] + ' created successfully.'
                    print 'Id: ' + response + '. Wait for the classifier to finish training.'
            elif len(parts) == 2:
                if parts[0] == 'delete':
                    cid = watson_nlc.find_classifier_by_name(parts[1])['classifier_id']
                    watson_nlc.delete_classifier(cid)


def session(service):
    if service == 'nlc':
        nlc_session()


command_prompt()
while True:
    command = raw_input('[main]> ')
    command = command.lower()
    if command == 'help':
        print_commands()
    elif command == 'exit':
        print_goodbye()
        break
    elif command == 'services':
        print_services()
    else:
        parts = command.split()
        if len(parts) == 2 and parts[0] == 'service' and parts[1].lower() in supported_services:
            session(parts[1].lower())
