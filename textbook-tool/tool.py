from cStringIO import StringIO
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument, PDFNoOutlines
from pdfminer.psparser import PSKeyword, PSLiteral, LIT
from pdfminer.pdftypes import PDFObjectNotFound, PDFValueError
from pdfminer.pdftypes import PDFStream, PDFObjRef, resolve1, stream_value
from pdfminer.utils import isnumber

def resolve_dest(dest):
    if isinstance(dest, str):
        dest = resolve1(doc.get_dest(dest))
    elif isinstance(dest, PSLiteral):
        dest = resolve1(doc.get_dest(dest.name))
    if isinstance(dest, dict):
        dest = dest['D']
    return dest

# Open a PDF document.
fp = open('Biology-LR.pdf', 'rb')

def convert_pdf_to_txt(fp, pagenos=set(), maxpages=0):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    caching = True
    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching, check_extractable=True):
        interpreter.process_page(page)
    text = retstr.getvalue()
    device.close()
    retstr.close()
    return text

def get_top_level_sections(fp):
    parser = PDFParser(fp)
    document = PDFDocument(parser, '')
    pages = dict( (page.pageid, pageno) for (pageno,page)
                  in enumerate(PDFPage.create_pages(document)) )


    section_pages = list()
    # Get the outlines of the document.
    try:
        outlines = document.get_outlines()
        for (level,title,dest,a,se) in outlines:
            if level != 1: continue
            pageno = None
            if dest:
                dest = resolve_dest(dest)
                pageno = pages[dest[0].objid]
                section_pages.append((title, pageno))
            #print "{l} - {t} {p}".format(l=level, t=title.encode('utf-8'), p=pageno)
    except PDFNoOutlines:
        pass
    parser.close()
    return section_pages

def convert_top_levels_to_pagenos(fp, top_levels):
    top_level_pages = get_top_level_sections(fp)
    pagenos = []
    #TODO(tylermzeller) support all top levels extraction
    if top_levels == []:
        pass
    for level in top_levels:
        start_idx = level
        end_idx = level + 1
        pagenos.append(range(top_level_pages[start_idx][1], top_level_pages[end_idx][1]))
    return [page for l in pagenos for page in l]


def extract_top_levels(fp, top_levels=[]):
    pagenos = convert_top_levels_to_pagenos(fp, top_levels)

    return convert_pdf_to_txt(fp, pagenos=set(pagenos))

#print convert_pdf_to_txt(fp)
txt = extract_top_levels(fp, top_levels=[1,2])
print txt
fp.close()
