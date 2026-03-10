#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r ../requirements.txt

# Convert static files
python manage.py collectstatic --no-input

# Add execution rights to run.sh
chmod +x run.sh

# Apply any outstanding database migrations (Commented out during build due to Render network issues)
# python manage.py migrate
