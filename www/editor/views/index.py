from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url="/login/")
def index(request):
    return HttpResponse(loader.get_template('editor/index.html').render(request))
