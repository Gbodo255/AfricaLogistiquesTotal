#!/usr/bin/env bash
python manage.py migrate --noinput
gunicorn africa_project.wsgi:application --log-level debug --access-logfile - --error-logfile -
