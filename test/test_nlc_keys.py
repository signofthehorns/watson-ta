from os import environ
from watson_developer_cloud import NaturalLanguageClassifierV1

def authenticate_nlc(x):
    nlc = NaturalLanguageClassifierV1(
	username=environ["watson_username"],
	password=environ["watson_password"],
    )
    nlc.list()

def test_keys():
    authenticate_nlc(3)
