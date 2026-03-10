#!/usr/bin/env bash
python manage.py migrate --noinput
python manage.py seed_data
gunicorn africa_project.wsgi:application
