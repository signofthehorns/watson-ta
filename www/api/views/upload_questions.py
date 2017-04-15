import re

from django import forms
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from doc_conversion import get_doc_coversion
from nlc_classify import get_question_type


@csrf_exempt
def upload_questions_file(request):
    if request.method == 'POST':
        if forms.Form(request.POST, request.FILES).is_valid():
            questions_raw = get_doc_coversion(request.FILES['file'])
            questions_raw = filter(
                (lambda question: question.strip()), questions_raw.split('\n'))
            print ""
            print ">> Raw Question: ", questions_raw
            print ""
            questions = []
            i = 0
            while i < len(questions_raw):
                question = {
                    "prompt":  questions_raw[i],
                    "choices": [],
                }

                # Why isalpha works somewhat?
                #  Our regular question is: 1. What is...
                #  For a multiple choice line it will look like: a. cake b. pie
                # So, If there is not a number we're assuming it's a multiple
                # choice question
                while (i < len(questions_raw) - 1) and questions_raw[i + 1][0].isalpha():
                    print ">> Parsing Choices"
                    choices = re.split(
                        '(?P<choice>(?:.(?![abcd][\.]))*)', questions_raw[i + 1])
                    question["choices"] = filter(
                        (lambda choice: choice.strip()), choices)
                    i = i + 1
                if question["prompt"] != 'no title':
                    questions.append({
                        'type': get_question_type(question["prompt"]),
                        'prompt': question["prompt"],
                        'choices': question["choices"],
                    })
                i = i + 1

            print questions
            return JsonResponse({
                'success': True,
                'questions': questions
            })
    return JsonResponse({'success': False})
