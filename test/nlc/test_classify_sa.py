from www.api.views.nlc_classify import get_question_type

def test_sa():
    assert get_question_type('What is the answer?')['class_name'] == 'SA'
