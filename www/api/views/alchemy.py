from django.http import JsonResponse

from classified import Classified


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
