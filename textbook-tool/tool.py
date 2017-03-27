# Example usages:
    # Print text from a pdf to the console:
        #print convert_pdf_to_txt(fp)

    # Print the text from a pdf's top levels to a file
        # txt = extract_top_levels(fp, top_levels=[1])
        # with open('chapter1.txt', 'w') as f:
        #     f.write(txt)
        #     f.write('\n')

    # Extract sections of the pdf to a separate pdf
        # pdf_writer = extract_top_levels_pdf(fp, top_levels=[1])
        # with open('chatper1.pdf', 'w') as f:
        #     # Note the receiver and argument order
        #     pdf_writer.write(f)

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
from PyPDF2 import PdfFileWriter, PdfFileReader
import watson_nlc
import watson_dc
import clean
import json

def resolve_dest(dest):
    if isinstance(dest, str):
        dest = resolve1(doc.get_dest(dest))
    elif isinstance(dest, PSLiteral):
        dest = resolve1(doc.get_dest(dest.name))
    if isinstance(dest, dict):
        dest = dest['D']
    return dest

# **Deprecated**. Use watson_dc.convert_pdf_to_txt() instead
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

# Returns a PyPDF2 file writer
def split_pdf(fp, pagenos=[]):
    # Remove any possible duplicate pages
    pagenos = list(set(pagenos))
    # Create the pdf reader
    inputpdf = PdfFileReader(fp)
    # Create the pdf writer
    output = PdfFileWriter()
    # Loop through all the page numbers we want to split
    for i in pagenos:
        # Add each page to the writer
        output.addPage(inputpdf.getPage(i))
    return output

# Gets all top level sections from the PDF
def get_top_level_sections(fp):
    # Create a parser
    parser = PDFParser(fp)
    # Create a document
    document = PDFDocument(parser, '')
    # Find all pages
    pages = dict( (page.pageid, pageno) for (pageno,page)
                  in enumerate(PDFPage.create_pages(document)) )

    section_pages = list()
    # Get the outlines of the document.
    try:
        outlines = document.get_outlines()
        for (level,title,dest,a,se) in outlines:
            # Skip all level besides top levels
            if level != 1: continue
            pageno = None
            # If there is a destination (page number)
            if dest:
                # Resolve the destination object
                dest = resolve_dest(dest)
                # Get the page number of the dest
                pageno = pages[dest[0].objid]
                # Append the section title and page number
                section_pages.append((title, pageno))
            #print "{l} - {t} {p}".format(l=level, t=title.encode('utf-8'), p=pageno)
    except PDFNoOutlines:
        pass
    parser.close()
    return section_pages

# This extracts all page numbers from selected top level sections of a textbook
def convert_top_levels_to_pagenos(fp, top_levels):
    # Get all pages from top level selections
    top_level_pages = get_top_level_sections(fp)
    pagenos = []
    #TODO(tylermzeller) support all top levels extraction
    if top_levels == []:
        pass
    # For each level specified, add the page range to the list of page numbers
    for level in top_levels:
        start_idx = level
        end_idx = level + 1
        pagenos.append(range(top_level_pages[start_idx][1], top_level_pages[end_idx][1]))
    # Flatten the list
    return [page for l in pagenos for page in l]

# This extracts text from selected top level section of a textbook
def extract_top_levels_txt(fp, top_levels=[]):
    # Get the page numbers for the sections to extract
    pagenos = convert_top_levels_to_pagenos(fp, top_levels)
    # Convert the selected pages from the PDF to text
    # TODO(tylermzeller) change the pagenos arg to a list, and convert to set in the implementation above
    return convert_pdf_to_txt(fp, pagenos=set(pagenos))

def extract_top_levels_pdf(fp, top_levels=[]):
    # Get the page number for the sections to extract
    pagenos = convert_top_levels_to_pagenos(fp, top_levels)
    # Convert the selected pages from the PDF into their own PDF
    return split_pdf(fp, pagenos=pagenos)

def write_pdf(filename, pdf_writer):
    with open(filename, 'wb') as f:
        # Note the receiver and argument order
        pdf_writer.write(f)

def write_text(filename, text):
    with open(filename, 'w') as f:
        f.write(text)

if __name__ == '__main__':
    classifier_name = 'biology_classifier'
    textbook_filename = 'Biology-LR.pdf'
    nlc_training_filename = 'chapter1_nlc_train.csv'
    extracted_pdf_filename = 'chapter2.pdf'
    extracted_text_filename = 'chapter2.txt'
    cleaned_text_filename = 'chapter2_clean.txt'
    # Step 1. we train a classifier on the first chapter (which I extracted previously)
    print 'Creating biology_classifier . . .'
    c = watson_nlc.find_classifier_by_name(classifier_name)
    cid = ''
    if c == None:
        cid = watson_nlc.train(nlc_training_filename, classifier_name)
        print 'NLC({0}) created.'.format(cid)
    else:
        cid = c['classifier_id']
        print 'Found classifier {0} with id NLC({1}). Skipping creation.'.format(classifier_name, cid)


    # Step 2. open the textbook pdf document.
    fp = open(textbook_filename, 'rb')

    # Step 3. extract the second chapter for testing purposes.
    print 'Extracting chapter from textbook . . .'
    pdf_writer = extract_top_levels_pdf(fp, top_levels=[2])

    # Step 4. Write the split pdf document.
    write_pdf(extracted_pdf_filename, pdf_writer)
    print 'Extraction done.'

    # Step 5. close the input pdf file
    fp.close()

    # Step 6. Use watson to convert the extracted pdf document to text
    print 'Converting the pdf to text . . .'
    success = watson_dc.convert_pdf_to_txt(extracted_pdf_filename, extracted_text_filename)
    if success:
        print 'Document conversion done.'

        # Step 7. Wait for the NLC
        print 'Waiting for NLC({0}). Training may take a few minutes . . .'.format(cid)
        watson_nlc.wait_for_available(cid)
        print 'NLC({0}) training done.'.format(cid)

        # Step 8. Clean the txt file for use with NLC
        clean.truncate_lines(extracted_text_filename, cleaned_text_filename)

        # Step 9. Classify the extracted text
        print 'Classifying chapter 2 text . . .'
        with open(cleaned_text_filename, 'r') as fis:
            content = ''
            qa = ''
            junk = ''
            for line in fis:
                if line == '\n': continue # skip empty lines
                klass = watson_nlc.classify(cid, line)
                if klass == 'content':
                    content += line
                elif klass == 'question' or klass == 'answer':
                    qa += line
                elif klass == 'junk':
                    junk += line

        # Step 10. Write the blocks of text to their respective files
        print 'Writing the classified text . . .'
        write_text('chapter2_content.txt', content)
        write_text('chapter2_qa.txt', qa)
        write_text('chapter2_junk.txt', junk)
        print 'Writing done.'

    else:
        print 'There was an error converting the pdf.'
