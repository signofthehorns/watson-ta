# Watson-TA
[![Build Status](https://travis-ci.org/signofthehorns/watson-ta.svg?branch=master)](https://travis-ci.org/signofthehorns/watson-ta)

<!-- TOC depthFrom:2 -->

- [What is Watson TA](#what-is-watson-ta)
- [Setup](#setup)
- [Watson TA Docker](#watson-ta-docker)
- [The Team](#the-team)

<!-- /TOC -->

## What is Watson TA

We plan on making the Watson TA. It will be a web app where students can upload a school assignment (homework, quiz, test, etc.) and Watson will tell the student if his/her answer is correct or not, give its own top 2 or 3 answers, and allow the student to drag and drop his/her favorite answer if the student wishes to take one of the suggested ones.

Extensions:
- Add 24/7 office hour TA so students can ask questions if they don't understand the suggested answers.

## Setup

### Watson TA Docker

1. Clone and cd into the `watson-ta` repository
2. Run `docker build -t watson-ta .`
3. Run the watson-ta container:

```BASH
# Mounting the watson-ta local repo & keys to enable active development
# Map the docker port `0.0.0.0:8000` to `127.0.0.1:8000`
# Enter an interactive terminal session of bash on the container
docker run -it --rm -v path/to/watson-ta:/app/ -v path/to/.keys.sh:/.keys.sh -p 127.0.0.1:8000:8000 watson-ta /bin/bash
```

4. Load the keys within the table `source .keys.sh`
5. Run the server:

```BASH
cd app/
python www/manage.py runserver 0.0.0.0:8000
```

6. Navigate to `localhost:8000` in a browser to interact with Watson TA
7. Develop away with hot reload!

## The Team

- Team: **Sign of the Horns (aka |..|,)**
- Members:
  - Dalton Flanagan
  - Liv Stanley
  - Bill Varcho
  - Tyler Zeller
  - David Soller

![Tyler...](images/bitmoji-lol.png)
![The Dab](images/bitmoji-dab.png)
