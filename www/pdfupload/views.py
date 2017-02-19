import json
import os
import sys

from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from api.views.nlc_classify import GetClassifyQuestion

#import github3


def index(request):
    template = loader.get_template('pdfupload/index.html')
    test_questions = [
        'what is the water cycle',
        'please explain why Jimmy Fallon always seems to be fake laughing',
        'what is your favorite flavor of ice cream',
    ]

    results = []
    for question in test_questions:
      results.append(GetClassifyQuestion(None, question))
    context = {
        'classifications': results,
    }
    return HttpResponse(template.render(context, request))

# -----------------------------------------------------------------------------
# Home page for watson ta


def home(request):
    template = loader.get_template('pdfupload/home.html')
    context = {
    }
    return HttpResponse(template.render(context, request))


# -----------------------------------------------------------------------------
# Team page
def get_team_data():
    # gh = github3.login(os.environ['github_username'],os.environ['github_password'])
    # repo = gh.repository('signofthehorns','watson-ta')
    team_members = []
    # for u in repo.contributors():
    #   user = gh.user(u)
    #   data = {
    #     'name': user.name,
    #     'avatar_url': user.avatar_url,
    #     'location': user.bio,
    #     'username': u
    #   }
    #   team_members.append(data)
    return team_members

# Team Info Page
def team(request):
    template = loader.get_template('pdfupload/team.html')
    team_data = get_team_data()
    context = {
        'data': team_data
    }
    return HttpResponse(template.render(context, request))
