import www.api.views.doc_conversion

def test_alchemy_example():
    test_file = "test/doc_conversion/test.pdf"
    expected_text = 'test\n\nThis is a test PDF document!'
    www.api.views.doc_conversion.get_doc_coversion(open(test_file))
