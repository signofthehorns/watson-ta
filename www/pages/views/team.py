import os
from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
import github3
from django.contrib.auth.decorators import login_required

def get_team_data():
    gh = github3.login(os.environ['github_username'],
                       os.environ['github_password'])
    repo = gh.repository('signofthehorns', 'watson-ta')
    team_members = []
    for u in repo.contributors():
        user = gh.user(u)
        data = {
            'name': user.name,
            'avatar_url': user.avatar_url,
            'location': user.bio,
            'username': u
        }
        team_members.append(data)
    return team_members

@login_required(login_url="/login/")
def GetTeamPage(request):
    template = loader.get_template('pages/team.html')
    team_data = get_team_data()
    context = {
        'data': team_data
    }
    return HttpResponse(template.render(context, request))
