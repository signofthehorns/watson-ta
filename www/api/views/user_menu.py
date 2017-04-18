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
                    "text": "CSE",
                    "url": "#",
                    "submenu": [
                        {
                            "text": "Homeworks",
                            "url": "#",
							"classcategory": "True",
                            "submenu": [
                                {
                                    "text": "HW1",
                                    "url": "#",
									"doc": "True",
                                    "submenu": None
                                },
                                {
                                    "text": "HW2",
                                    "url": "#",
									"doc": "True",
                                    "submenu": None
                                }
                            ]
                        },
                        {
                            "text": "Quizzes",
                            "url": "#",
							"classcategory": "True",
                            "submenu": None
                        }
                    ]
                }
            ]
        }
    )
