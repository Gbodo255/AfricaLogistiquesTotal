#!/usr/bin/env bash
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -R
python manage.py migrate --noinput
gunicorn africa_project.wsgi:application --log-level debug --access-logfile - --error-logfile -
