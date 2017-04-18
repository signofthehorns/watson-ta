from www.api.views.nlc_classify import get_question_type

def test_mc():
    assert get_question_type('What is the answer? a) blue b) green c) yellow')['class_name'] == 'MC'
