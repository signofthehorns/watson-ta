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
