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

# Add alias: webpack, cl, serve
# TODO: Convert to makefile?
RUN echo 'alias webpack="/node_modules/.bin/webpack"' >> ~/.bashrc
RUN echo 'alias cl="clear"' >> ~/.bashrc
RUN echo 'alias serve="python manage.py runserver 0.0.0.0:8000"' >> ~/.bashrc
