import os
from watson_developer_cloud import DocumentConversionV1

document_conversion = DocumentConversionV1(
    username=os.environ['watson_dc_username'],
    password=os.environ['watson_dc_password'],
    version='2017-03-23')

try:
    # Example of retrieving html or plain text
    with open('chapter1.pdf', 'r') as document:
        with open('chapter1-doc-conv.txt', 'w') as output_stream:
            config = {'conversion_target': DocumentConversionV1.NORMALIZED_TEXT}
            result = document_conversion.convert_document(
                document=document, config=config).content
            output_stream.write(result)
      #   print(document_conversion.convert_document(
      #       document=document, config=config).content)
except WatsonException as e:
    print e
