from os import environ
from watson_developer_cloud import AlchemyLanguageV1

def authenticate_alchemy(url):
    alch = AlchemyLanguageV1(
	api_key=environ['watson_alchemy_key']
    )
    alch.emotion(url=url)

def test_keys():
    authenticate_alchemy("http://www.google.com")

