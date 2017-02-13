echo "Entering virtual environment..."
source bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Installing Node dependencies..."
npm install

echo "Done. Happy teaching!"
