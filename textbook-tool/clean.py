# Clear a file, if it exists
def empty(filename):
    with open(filename, 'w'): pass

# Simply threshold the lines of the chapter
def threshold(threshold=81):
    filename = 'chapter1-thresh.txt'
    empty(filename)
    with open(filename, 'w') as f:
        with open('chapter1.txt') as fp:
            for line in fp:
                if len(line) > threshold or line == '\n':
                    f.write(line)

# Threshold but keep lines that continue on from a non-terminated sentence
def threshold_with_continuity(filename, threshold=81, terminators=['.']):
    empty(filename)
    with open(filename, 'w') as f:
        with open('chapter1.txt') as fp:
            terminated = True
            for line in fp:
                if len(line) > threshold or line == '\n' or not terminated:
                    # TODO(tylermzeller) potential list index exception below. How to handle?
                    terminated = line == '\n' or line[-2] in terminators
                    f.write(line)

# Remove all commas for pre-processing before NLC
def remove_commas(filename, out_filename):
    with open(filename, 'r') as fis: # open input file
        with open(out_filename, 'w') as fos: # open output file
            for line in fis: # loop through ea. line
                if line == '\n': continue # if it's an empty line, just ignore
                fos.write(line.replace(",", "")) # erase commas

# Append ",content" to csv file lines without a label. Useful for annotating training data for NLC
def append_content(filename, out_filename):
    with open(filename, 'r') as fis: # open input file
        with open(out_filename, 'w') as fos: # open output file
            for line in fis: # loop through ea. line
                parts = line.split(',') # split on comma
                if len(parts) == 1: # if line has no label yet
                    line = line.strip('\n') # remove the newline char
                    line = line + ',content\n' # append the content label and newline
                fos.write(line) # write to output

# Truncate any line over the limit of 1,024 characters.
def truncate_lines(filename, out_filename):
    with open(filename, 'r') as fis: # open input file
        with open(out_filename, 'w') as fos: # open output file
            for line in fis: # loop through ea. line
                while len(line) > 1024:
                    idx = line.rfind('.', 0, 1024)
                    if idx == -1:
                        idx = line.rfind(' ', 0, 1024)
                    trunc_line = line[:idx + 1] + '\n'
                    print len(trunc_line)
                    fos.write(trunc_line)
                    line = line[idx + 1:]
                fos.write(line) # write to output

# This attempts to parse questions and matching answers from a mal-formed file
# containing questions and answers.
# TODO(tylermzeller) relax assumptions
# Assumes:
#   1. Questions start with a #. label (1., 2., etc.)
#   2. for MC questions, there are 4 answers, labeled a. b. c. or d.
#   3. questions are followed immediately by their answers. If there aren't any
#      answers, the question is assumed to be a SA.
#   4. there are no TF questions (there aren't any in the Biology textbook)
def parse_qa(filename, out_filename):
    q_start_re = r'/\d+\. /g'
    a_mc_re = r'/\b[abcd]\./g'
    data = ''
    with open('data.txt', 'r') as myfile:
        data = myfile.read().replace('\n', '')

    reiter = re.finditer(q_start_re, String)
    indices = [m.start(0) for m in reiter]
#threshold_with_continuity(filename='chapter1-thresh-cont.txt', terminators=['.', ')'])
#remove_commas(filename='chapter1-doc-conv.txt', out_filename='chapter1-no-commas.txt')
#append_content(filename='chapter1-no-commas.txt', out_filename='chapter1-nlc-train.csv')
#truncate_lines('chapter1-nlc-train.csv', 'chapter1_nlc_train.csv')
