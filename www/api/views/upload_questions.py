import re

from django import forms
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from classified import Classified
from doc_conversion import get_doc_coversion
from nlc_classify import get_question_type


def extract_questions(text):
    text = text.replace('\t', ' ')
    pattern = '[0-9]+(\)|\.)(?:(?![0-9]+(\)|\.)).)*'
    res = [match.group(0) for match in re.finditer(pattern, text)]
    obj_res = []
    for r in res:
        rmap = {
            'class_name': 'TF',
            'confidence': 0.0
        }
        # todo get classified result
        obj_res.append(Classified(r[4:-1], rmap).get_map_repr())
    # order questions and classify
    return obj_res


@csrf_exempt
def upload_questions_file(request):
    if request.method == 'POST':
        if forms.Form(request.POST, request.FILES).is_valid():
            questions_raw = get_doc_coversion(request.FILES['file'])
            questions = []
            for question in questions_raw.split('\n'):
                question = question.strip()
                if question != '':
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
