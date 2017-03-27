import os
from watson_developer_cloud import DocumentConversionV1

def get_dc_instance():
    return DocumentConversionV1(
        username=os.environ['watson_dc_username'],
        password=os.environ['watson_dc_password'],
        version='2015-12-15') # this is the most current version

def convert_pdf_to_txt(filename, out_filename, dc=None):
    if dc == None:
        dc = get_dc_instance()

    success = True
    try:
        # Example of retrieving html or plain text
        with open(filename, 'r') as fis:
            with open(out_filename, 'w') as fos:
                config = {'conversion_target': DocumentConversionV1.NORMALIZED_TEXT}
                result = dc.convert_document(document=fis, config=config)
                fos.write(result.content)
    except WatsonException as e:
        print e
        success = False
    finally:
        return success

# TODO(tylermzeller): finish the command line code
if __name__ == '__main__':
    pass
    # try:
    #     # Example of retrieving html or plain text
    #     with open('chapter1.pdf', 'r') as document:
    #         with open('chapter1-doc-conv.txt', 'w') as output_stream:
    #             config = {'conversion_target': DocumentConversionV1.NORMALIZED_TEXT}
    #             result = document_conversion.convert_document(
    #                 document=document, config=config).content
    #             output_stream.write(result)
    #       #   print(document_conversion.convert_document(
    #       #       document=document, config=config).content)
    # except WatsonException as e:
    #     print e
