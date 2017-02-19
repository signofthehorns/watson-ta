import re
from cStringIO import StringIO

from django import forms
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
from pdfminer.pdfpage import PDFPage

from api.views.classified import Classified


def convert_pdf_to_txt(fp):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos = set()
    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching, check_extractable=True):
        interpreter.process_page(page)
    text = retstr.getvalue()
    fp.close()
    device.close()
    retstr.close()
    return text


class UploadFileForm(forms.Form):
    file = forms.FileField()


def extract_questions(text):
    text = text.replace('\t', ' ')
    pattern = '[0-9]+(\)|\.)(?:(?![0-9]+(\)|\.)).)*'
    m = re.finditer(pattern, text)
    res = [match.group(0) for match in m]

    obj_res = []
    for r in res:
        rmap = {
            'class_name': 'TF',
            'confidence': 0.0
        }
        # todo get classified result
        obj_res.append(Classified(r, rmap).get_map_repr())
    # order questions and classify
    return obj_res


def handle_uploaded_file(f):
    text = convert_pdf_to_txt(f)
    questions = extract_questions(text)
    return questions

# LOL, using this decorator because of laziness right
# now. in the future we will want to securely send
# files


@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            text = handle_uploaded_file(request.FILES['file'])
            return JsonResponse({
                'success': True,
                'text': text
            })
    return JsonResponse({'success': False})
