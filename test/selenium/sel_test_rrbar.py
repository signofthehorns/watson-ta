#!/usr/bin/env python
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from time import sleep, time
import re, datetime

#Test Purpose: Ensure Retrieve and Rank search bar is working 
 
USER = "admin"
PASS = "watsonta"

#open home page
browser = webdriver.Firefox()
browser.get("http://localhost:8000/pdfupload")
#log in
browser.find_element_by_id("id_username").send_keys(USER)
browser.find_element_by_id("id_password").send_keys(PASS)
browser.find_element_by_tag_name("input").submit()
sleep(10.0)

#enter query in rr search bar
browser.find_element_by_id("rr_query").send_keys("snape")
browser.find_element_by_id("rr_query").submit()
sleep(3.0)

#enter second query in rr search bar
browser.find_element_by_id("rr_query").send_keys("voldemort")
browser.find_element_by_id("rr_query").submit()
sleep(3.0)
