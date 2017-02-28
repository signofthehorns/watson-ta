from cStringIO import StringIO
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdftypes import resolve1

# Open a PDF document.
fp = open('Biology-LR.pdf', 'rb')

def convert_pdf_to_txt(fp):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 4
    caching = True
    pagenos = set()
    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching, check_extractable=True):
        interpreter.process_page(page)
    text = retstr.getvalue()
    fp.close()
    device.close()
    retstr.close()
    return text

def get_table_of_contents(fp):
    parser = PDFParser(fp)
    document = PDFDocument(parser, '')

    # Get the outlines of the document.
    outlines = document.get_outlines()
    for (level,title,dest,a,se) in outlines:
        print "{l} - {t} {d}".format(l=level, t=title.encode('utf-8'), d=dest)

#print convert_pdf_to_txt(fp)
get_table_of_contents(fp)
