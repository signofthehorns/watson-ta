#!/usr/bin/env python
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from time import sleep, time
import re, datetime

#Test Purpose: Ensure each tab on nav bar is working properly
 
USER = "admin"
PASS = "watsonta"

#open home page
browser = webdriver.Firefox()
browser.get("http://localhost:8000/")
#navigate to pdf upload page
browser.find_element_by_link_text("PDF Upload").click()
sleep(5.0)
#log in
browser.find_element_by_id("id_username").send_keys(USER)
browser.find_element_by_id("id_password").send_keys(PASS)
browser.find_element_by_tag_name("input").submit()
sleep(7.0)

#navigate to editor page
browser.find_element_by_link_text("Editor").click()
sleep(5.0)

#navigate to team page - TEAM PAGE NOT SET UP YET
#browser.find_element_by_link_text("The Team").click();
#sleep(1000)

#navigate to home page
browser.find_element_by_link_text("💡 Watson-TA").click()

