from os import environ
from watson_developer_cloud import RetrieveAndRankV1

def test_rr():
    RetrieveAndRankV1(
        username=environ['watson_rr_username'],
        password=environ['watson_rr_password']
    )

def test_keys():
    test_rr()

