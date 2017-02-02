'''
Somewhat hacky script to get candidate questions for training from MIT open
courseware. Will write candidate questions to 'out.txt' (I'll upload the output)
once it is done running on my machine. Basically looking for numbered question
blocks in pdfs on the website under assignments and exams.
'''


# part one get all urls + links

from bs4 import BeautifulSoup
import urllib2
import re

# # download pdf and convert to text
# import urllib2

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from cStringIO import StringIO

def convert_pdf_to_txt(url):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    download = urllib2.urlopen(url)
    with open('data','w') as output:
        output.write(download.read())
    fp = file('data', 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos=set()
    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
        interpreter.process_page(page)
    text = retstr.getvalue()
    fp.close()
    device.close()
    retstr.close()
    return text


# get candidate questions on preprocessed text
def get_candidate_questions(text):
  pattern = '[0-9]+(\)|\.)(?:(?![0-9]+(\)|\.)).)*'
  m = re.finditer(pattern, text)
  return [match.group(0) for match in m]

def filter_questions(possible):
  N = 1
  res = []
  for p in possible:
    m = re.search('([0-9]*)(\)|\.)(?<![0-1]) ',p)
    if m is not None and m.group(1) is not None:
      match = m.group(1)
      if len(match) > 0 and int(match) == N:
        # TODO: remove numbering
        res.append(p)
        N += 1
  return res

# once we get course append assignment and exams
def process(text):
  # remove special chars
  # text = re.sub('[^a-zA-Z0-9 \n\.\)]', '', text)
  # remove newlines
  text = text.replace('\n','')
  possible = get_candidate_questions(text)
  return filter_questions(possible)

DONE = set([])
def get_course_questions(BASE_URL):
  arr = []
  if BASE_URL not in DONE:
    MIT_BASE = 'https://ocw.mit.edu'
    resp = urllib2.urlopen(BASE_URL)
    soup = BeautifulSoup(resp,'lxml')
    # # get the classes for mit open course ware
    for link in soup.find_all('a', href=True):
      if link['href'].endswith('.pdf'):
        res = convert_pdf_to_txt(MIT_BASE + link['href'])
        questions = process(res)
        if len(questions) > 0:
          for q in questions:
            arr.append(q)
    DONE.add(BASE_URL)
  return arr

MIT_BASE = 'https://ocw.mit.edu'
URL = 'https://ocw.mit.edu/courses/?utm_source=ocw-megamenu&utm_medium=link&utm_campaign=mclstudy'
resp = urllib2.urlopen(URL)
soup = BeautifulSoup(resp, 'lxml')

https://ocw.mit.edu/courses/biology/7-016-introductory-biology-fall-201

# get the classes for mit open course ware
with open('out.txt','w') as f:
  for i,link in enumerate(soup.find_all('a', href=True)):
    print(i,link)
    if link['href'].startswith('/courses'):
      try:
        # scrape assignments
        course_assignments_url = MIT_BASE+link['href']+'/assignments/'
        # make sure exists
        urllib2.urlopen(course_assignments_url)
        for q in get_course_questions(course_assignments_url):
          f.write(q)
          f.write('\n')
        # scrape exams
        course_exams_url = MIT_BASE+link['href']+'/exams/'
        # make sure exists
        urllib2.urlopen(course_exams_url)
        for q in get_course_questions(course_exams_url):
          f.write(q)
          f.write('\n')
      except urllib2.HTTPError, e:
        continue
      except urllib2.URLError, e:
        continue

#1556