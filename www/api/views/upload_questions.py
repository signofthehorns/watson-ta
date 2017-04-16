import re

from django import forms
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from doc_conversion import get_doc_coversion
from nlc_classify import get_question_type


MATCH_QUESTION_CHOICES = r'(?P<choice>(?:.(?![abcdABCD][\.\:]))*)'
MATCH_NUMERATED_QUESTION = r'(\d+\..+?(?:(?=(?:\d+\.))|(\n|\r)))'

"""
Takes text and removes blank, None or whitespace only strings
"""
def clean(text):
    text = filter((lambda piece: piece != None and piece.strip()), text)
    return text

"""
Takes text and returns the extracted choices
"""
def extract_choices(text):
    choices = re.split(MATCH_QUESTION_CHOICES, text)
    choices = clean(choices)
    return choices

@csrf_exempt
def upload_questions_file(request):
    if request.method == 'POST':
        if forms.Form(request.POST, request.FILES).is_valid():
            questions_raw = get_doc_coversion(request.FILES['file'])
            questions_raw = clean(questions_raw.split('\n'))
            new_questions = []
            for question in questions_raw:
                new_questions = new_questions + clean(re.split(MATCH_NUMERATED_QUESTION, question))
            questions_raw = new_questions
            print '\n', '>> Raw Question: ', questions_raw, '\n'

            questions = []
            i = 1
            while i < len(questions_raw):
                prompt = questions_raw[i]

                # Dropping:
                # - Title (i = 1 drops)
                # - Any lines that don't start numbered
                if prompt[0].isdigit():
                    question_type = get_question_type(prompt)
                    choices = extract_choices(prompt)
                    prompt = choices[0]
                    question_choices = choices[1:]

                    # Why isalpha works somewhat?
                    #  Our regular question is: 1. What is...
                    #  For a multiple choice line it will look like: a. cake b. pie
                    # So, If there is not a number we're assuming it's a multiple
                    # choice question
                    while (i < len(questions_raw) - 1) and questions_raw[i + 1][0].isalpha():
                        print '>> Parsing Choices'
                        question_choices = question_choices + extract_choices(questions_raw[i + 1])
                        question_type = {
                            'class_name': 'MC',
                            'confidence': 1,
                        }
                        i = i + 1

                    # Fix question label issue as if no choices were extracted,
                    #  it cannot be multiple choice...
                    # Note we should capture these to fix the classifier :D
                    if question_type['class_name'] == 'MC' and not question_choices:
                        question_type = {
                            'class_name': 'SA',
                            'confidence': 0,
                        }

                    # Create final question
                    questions.append({
                        'type': question_type,
                        'prompt': prompt,
                        'choices': question_choices,
                    })
                i = i + 1

            print '\n', questions, '\n'
            return JsonResponse({
                'success': True,
                'questions': questions
            })
    return JsonResponse({'success': False})
