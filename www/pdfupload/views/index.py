from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from api.views.nlc_classify import GetClassifyQuestion
from django.contrib.auth.decorators import login_required

@login_required(login_url="/login/")
def index(request):
    template = loader.get_template('pdfupload/index.html')
    test_questions = [
        'what is the water cycle',
        'please explain why Jimmy Fallon always seems to be fake laughing',
        'what is your favorite flavor of ice cream',
    ]
    results = []
    for question in test_questions:
        results.append(GetClassifyQuestion(request, question))
    context = {
        'classifications': results,
    }
    return HttpResponse(template.render(context, request))
