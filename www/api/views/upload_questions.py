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
            questions = []
            for question in questions_raw.split('\n'):
                question = question.strip()
                if question != '' and question != 'no title':
                    questions.append({
                        'type': get_question_type(question),
                        'prompt': question,
                    })
                    # TODO: Parse out choices for MC

            return JsonResponse({
                'success': True,
                'questions': questions
            })
    return JsonResponse({'success': False})
