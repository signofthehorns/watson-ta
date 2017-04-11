import www.api.views.doc_conversion

def test_alchemy_example():
    test_file = "test/doc_conversion/test.docx"
    expected_text = 'Microsoft Word - This is a test Word document.docx\n\nThis is a test PDF document!'
    www.api.views.doc_conversion.get_doc_coversion(open(test_file))
