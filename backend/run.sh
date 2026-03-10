#!/usr/bin/env bash
echo "=== DEPLOY TEST V2 ==="
gunicorn africa_project.wsgi:application --log-level debug --access-logfile - --error-logfile -
