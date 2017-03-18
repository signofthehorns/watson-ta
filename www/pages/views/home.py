from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.contrib.auth.decorators import login_required

def GetHomePage(request):
    template = loader.get_template('pages/home.html')
    context = {
    }
    return HttpResponse(template.render(context, request))
