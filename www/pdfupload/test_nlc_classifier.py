import views

def test_classify_questions():
    from django.conf import settings
    if not settings.configured:
        settings.configure(DEBUG=True)
    questions = ["This is a question", "This is also a question"]
    views.classify_questions(questions)