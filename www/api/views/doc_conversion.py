import os
from watson_developer_cloud import DocumentConversionV1, WatsonException


def get_doc_coversion(fp):
    document_conversion = DocumentConversionV1(
        username=os.environ['watson_dc_username'],
        password=os.environ['watson_dc_password'],
        version='2017-03-23')
    result = ''

    try:
        # Example of retrieving html or plain text
        # with open(fp, 'r') as document:
        config = {
            'conversion_target': DocumentConversionV1.NORMALIZED_TEXT
        }
        result = document_conversion.convert_document(
            document=fp, config=config).content
    except WatsonException as e:
        print e

    return result
