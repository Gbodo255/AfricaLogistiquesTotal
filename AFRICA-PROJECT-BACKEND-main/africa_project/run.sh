#!/usr/bin/env bash
# Redirect everything to boot.log in the root of the repo
exec > ../../boot.log 2>&1

echo "=== LOG HIJACK START (FALLBACK) ==="
echo "Current directory: $(pwd)"
echo "Date: $(date)"
echo "Files:"
ls -R

echo "=== RUNNING MIGRATIONS ==="
python manage.py migrate --noinput

echo "=== STARTING GUNICORN ==="
gunicorn africa_project.wsgi:application --log-level debug --access-logfile - --error-logfile -
