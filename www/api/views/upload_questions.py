import re

from django import forms
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from classified import Classified
from doc_conversion import get_doc_coversion
from nlc_classify import get_question_type


@csrf_exempt
def upload_questions_file(request):
    if request.method == 'POST':
        if forms.Form(request.POST, request.FILES).is_valid():
            questions_raw = get_doc_coversion(request.FILES['file'])
            questions_raw = questions_raw.split('\n')
            questions = []
            i = 0
            while i < len(questions_raw):
                question = questions_raw[i].strip()
                nextIsAlpha = True
                while nextIsAlpha and (i < len(questions_raw)-1):
                    if questions_raw[i+1].strip() == '':
                        i = i + 1
                    elif questions_raw[i+1].strip()[0].isalpha():
                        question = question + " " + questions_raw[i+1].strip()
                        i = i + 1
                    else:
						nextIsAlpha = False
                if question != '' and question != 'no title':
                    questions.append({
                        'type': get_question_type(question),
                        'prompt': question,
                    })
                    # TODO: Parse out choices for MC
                i = i + 1
            return JsonResponse({
                'success': True,
                'questions': questions
            })
    return JsonResponse({'success': False})
