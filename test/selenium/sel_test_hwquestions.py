#!/usr/bin/env python
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from time import sleep, time
import re, datetime

#Test Purpose: Ensure HW questions are available for user input
 
USER = "admin"
PASS = "watsonta"

#open pdf page
browser = webdriver.Firefox()
browser.get("http://localhost:8000/pdfupload")
#log in
browser.find_element_by_id("id_username").send_keys(USER)
browser.find_element_by_id("id_password").send_keys(PASS)
browser.find_element_by_tag_name("input").submit()
sleep(10.0)

#test true/false radio buttons
browser.find_element_by_xpath("//input[@name='optionsRadios' and @value='option2']").click()
sleep(3.0)

#test short answer comment box
browser.find_element_by_id("comment").send_keys("Wingardium leviosa!")
sleep(3.0)
