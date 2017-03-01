##################################################
##  Watson-TA Docker Development Setup Script   ##
##################################################

# Setup the auto Django super user creation
USER="admin"
PASS="watsonta"
MAIL="admin@example.com"
script="
from django.contrib.auth.models import User;

username = '$USER';
password = '$PASS';
email = '$MAIL';

if User.objects.filter(username=username).count()==0:
    User.objects.create_superuser(username, email, password);
    print('Superuser created.');
else:
    print('Superuser creation skipped.');
"

# Aliases for common opperations
#  webpack -- executes the webpack program used to bundle the JavaScript
#  cl      -- a consise clear
#  serve   -- run the django serve with the desired configuration
#  keys    -- load the keys file
#  csu     -- create superuser for the site
#  up      -- fully loads the serve in a single command!:D
#  rb      -- rebuild webpack and serve
alias webpack="/node_modules/.bin/webpack"
alias cl="clear"
alias serve="python manage.py runserver 0.0.0.0:8000"
alias keys="source /app/.keys.sh"
alias csu="python manage.py migrate && echo \"$script\" | python manage.py shell"
alias up="keys && csu && webpack && serve"  
alias rb="webpack && serve"
