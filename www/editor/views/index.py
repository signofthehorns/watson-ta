from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render

def index(request):
    return HttpResponse(loader.get_template('editor/index.html').render(request))
