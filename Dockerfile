# Installs python 2.7
FROM python:2.7

# Installs Nodejs & NPM
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

# Install the python requirements
ADD requirements.txt /
RUN pip install -r requirements.txt

# Install the npm packages
ADD package.json /
RUN npm install

# Ports
EXPOSE 8000

# Add alias for common opperations
#  webpack -- executes the webpack program used to bundle the JavaScript
#  cl      -- a consise clear
#  serve   -- run the django serve with the desired configuration
#  keys    -- load the keys file
#  cdw     -- a consise directory switch to the watson-ta project
#  up      -- fully loads the serve in a single command!:D
RUN echo 'alias webpack="/node_modules/.bin/webpack"' >> ~/.bashrc
RUN echo 'alias cl="clear"' >> ~/.bashrc
RUN echo 'alias serve="python manage.py runserver 0.0.0.0:8000"' >> ~/.bashrc
RUN echo 'alias keys="source /app/.keys.sh"' >> ~/.bashrc
RUN echo 'alias cdw="cd /app/www/"' >> ~/.bashrc
RUN echo 'alias up="keys && cdw && webpack && serve"' >> ~/.bashrc

# Prevent Python from generating .pyc files on Docker while
# source files are actually on host machine
# (this confuses pytest)
ENV PYTHONDONTWRITEBYTECODE=1
