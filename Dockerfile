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

# Add alias for common opperations (tr -d '\015' removes CLRF extensions)
ADD .docker-setup.sh /.bashrc
RUN /bin/bash -c "tr -d '\015' < /.bashrc > ~/.bashrc"

# Setup parameters
EXPOSE 8000
WORKDIR /app/www/

# Prevent Python from generating .pyc files on Docker while
# source files are actually on host machine
# (this confuses pytest)
ENV PYTHONDONTWRITEBYTECODE=1
