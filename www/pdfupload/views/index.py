from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.contrib.auth.decorators import login_required

@login_required(login_url="/accounts/login/")
def index(request):
    template = loader.get_template('pdfupload/index.html')
    return HttpResponse(template.render(request))
