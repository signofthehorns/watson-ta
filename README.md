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

1. Clone and `cd` into the `watson-ta` repository (e.g. `pwd` should end in `watson-ta/`)
2. Add the API keys to a `.keys.sh` file (placed in `watson-ta/`)

```BASH
## The keys required for Watson-TA
# NLC
export watson_username=''
export watson_password=''

# Alchemy
export watson_alchemy_key=''

# Retrieve and Rank
export watson_rr_username=''
export watson_rr_password=''
export watson_rr_cluster_id=''

# Document Conversion
export watson_dc_username=''
export watson_dc_password=''

# Github
export github_username=''
export github_password=''
```

3. Build the container by running:

```BASH
# Builds a container named "watson-ta" from the Dockerfile at . (e.g. the current directory)
docker build -t watson-ta .
```

4. Enter the container by running:

```BASH
# Mounting the watson-ta local repo & keys to enable active development
# Map the docker port `0.0.0.0:8000` to local port `127.0.0.1:8000`
# Enter an interactive terminal session of bash on the container
docker run -it --rm -v `pwd`:/app/ -p 127.0.0.1:8000:8000 watson-ta /bin/bash
```

5. You should now be within the watson-ta docker container!
6. Run the alias `up` to setup remaining configuration and boot the django server. The `up` command does the following:

```BASH
# Notice: These are bash aliases defined in the .docker-setup.sh :)
# Run all within: /app/www/
# What up runs for you:
keys       # Load the keys
csu        # Create superusers
           #   username:   admin
           #   password:   watsonta
           #   email:      admin@example.com
webpack    # Execute webpack using the `webpack.config.js`
serve      # Execute the alias serve
```

7. Navigate to `localhost:8000` in a browser to interact with Watson TA application
8. The login is the following:

```BASH
username = "admin"
password = "watsonta"
email    = "admin@example.com"
```

9. Develop away with hot reload!
10. If you need to recompile the JavaScript use `rb` to rebuild the JavaScript and rerun the server

## The Team

Team: **Sign of the Horns (aka |..|,)**

Dalton Flanagan | Liv Stanley | Bill Varcho | Tyler Zeller | David Soller
---             | ---         | ---         | ---          | ---
[github.com/dltn](https://github.com/dltn) | [github.com/livstanley29](https://github.com/livstanley29) | [github.com/Varcho](https://github.com/Varcho) | [github.com/tylermzeller](https://github.com/tylermzeller) | [github.com/3ygun](https://github.com/3ygun)
![Dalton](images/dalton.jpg) | ![Leb](images/leb.jpg) | ![Bill](images/bill.png) | ![Tyler...](images/tyler.png) | ![David](images/david.png)
