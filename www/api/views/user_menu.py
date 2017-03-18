from django.http import JsonResponse


def GetUserMenuRequest(request):
    return JsonResponse(
        {
            "menu": [
                {
                    "text": "Biology",
                    "url": "#",
                    "submenu": None
                },
                {
                    "text": "Physics",
                    "url": "#",
                    "submenu": None
                },
                {
                    "text": "Chemistry",
                    "url": "#",
                    "submenu": [
                        {
                            "text": "Homeworks",
                            "url": "#",
                            "submenu": [
                                {
                                    "text": "HW1",
                                    "url": "#",
                                    "submenu": None
                                },
                                {
                                    "text": "HW2",
                                    "url": "#",
                                    "submenu": None
                                }
                            ]
                        },
                        {
                            "text": "Quizzes",
                            "url": "#",
                            "submenu": None
                        }
                    ]
                }
            ]
        }
    )
