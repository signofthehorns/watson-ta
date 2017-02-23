import os

from watson_developer_cloud import AlchemyLanguageV1


class Classified(object):

    def __init__(self, question_, class_=None):
        self.question = question_
        if class_ is not None:
            self.tag, self.conf = class_['class_name'], class_['confidence']
        self.words = [
            {'fragment': self.question, 'tag': None}
        ]

    def get_map_repr(self):
        return {
            'tag': self.tag,
            'text': self.question
        }

    def set_fragmented_text(self, text, indices, tags):
        if len(indices) == 0:
            return
        # sort tags in order for easier processing
        indices, tags = zip(*sorted(zip(indices, tags)))
        self.words = []
        current_index = 0
        for i, p in enumerate(indices):
            start, end = p
            before = text[current_index:start]
            kw = text[start:end]
            self.words.append({'fragment': before, 'tag': None})
            self.words.append({'fragment': kw, 'tag': tags[i]},)
            current_index = end + 1
        if current_index < len(text):
            self.words.append({'fragment': text[current_index:], 'tag': None})

    def set_entities(self):
        # TODO if question is more than one sentence split into
        # individual calls
        alchemy_language = AlchemyLanguageV1(
            api_key=os.environ['watson_alchemy_key'])
        query = alchemy_language.combined(
            text=self.question,
            extract='keywords,concepts',
            sentiment=1,
            max_items=15)
        # self.entities = query['entities']
        self.keywords = query['keywords']
        self.concepts = query['concepts']

        indices = []
        tags = []
        for k in self.keywords:
            text = k['text']
            sentiment = k['sentiment']['type']
            start = self.question.index(text)
            indices.append((start, start + len(text)))
            tags.append('entity-' + sentiment)
        # find range
        self.set_fragmented_text(self.question, indices, tags)
