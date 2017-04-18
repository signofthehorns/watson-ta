from www.api.views.nlc_classify import get_question_type

def test_tf():
    assert get_question_type('The answer is orange.')['class_name'] == 'TF'
