from os import environ
from www.api.views.rr_search import *

def dumbledore_search():
    return execute_query("hp_collection", "dumbledore")

def test_keys():
    assert dumbledore_search()["responseHeader"]["status"] == 0

