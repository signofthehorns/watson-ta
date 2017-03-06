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
def threshold_with_continuity(threshold=81, terminators=['.']):
    filename = 'chapter1-thresh-cont.txt'
    empty(filename)
    with open(filename, 'w') as f:
        with open('chapter1.txt') as fp:
            terminated = True
            for line in fp:
                if len(line) > threshold or line == '\n' or not terminated:
                    # TODO(tylermzeller) potential list index exception below. How to handle?
                    terminated = line == '\n' or line[-2] in terminators
                    f.write(line)

threshold_with_continuity(terminators=['.', ')'])
