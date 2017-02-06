# Watson-TA
[![Build Status](https://travis-ci.org/signofthehorns/watson-ta.svg?branch=master)](https://travis-ci.org/signofthehorns/watson-ta)

# Setup:
Activate the virtual environment and install the dependencies:
```BASH
source bin/activate

pip install -r requirements.txt
npm install
```

Then, start the django webserver:
```BASH
cd ~/www/
python manage.py runserver
```
And then view the example page at localhost:8080/pdfupload/

It should look like...
![Hello World](https://github.com/signofthehorns/watson-ta/blob/master/firstpage.png)

Remember to set shell vars
```BASH
export watson_username
export watson_password
```

# Info
- Team: **Sign of the Horns (aka |..|,)**
- Members:
  - Dalton Flanagan
  - Liv Stanley
  - Bill Varcho
  - Tyler Zeller
  - David Soller
  
- Project:
  > We plan on making the Watson TA. It will be a web app where students can upload a school assignment (homework, quiz, test, etc.) and Watson will tell the student if his/her answer is correct or not, give its own top 2 or 3 answers, and allow the student to drag and drop his/her favorite answer if the student wishes to take one of the suggested ones.
  >
  > Extensions:
  > - add 24/7 office hour TA so students can ask questions if they don't understand the suggested answers.

![Image of Tyler](https://github.com/signofthehorns/watson-ta/blob/master/lol.png)
![Dab](https://github.com/signofthehorns/watson-ta/blob/master/dab.png)
