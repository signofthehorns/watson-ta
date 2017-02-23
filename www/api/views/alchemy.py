from django.http import JsonResponse

from api.views.classified import Classified


def GetAlchemyRequest(request, sentence):
    cs = Classified(sentence)
    cs.set_entities()
    return JsonResponse(
        {
            'words': cs.words,
            'keywords': cs.keywords,
            'concepts': cs.concepts,
        }
    )
