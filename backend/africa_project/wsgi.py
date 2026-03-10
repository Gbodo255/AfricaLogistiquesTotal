"""
WSGI config for africa_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys
import traceback

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africa_project.settings')

def application(environ, start_response):
    path = environ.get('PATH_INFO', '')
    if path == '/render_logs/':
        status = '200 OK'
        # boot.log is in the parent of the rootDir (backend)
        log_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'boot.log'))
        if os.path.exists(log_path):
            with open(log_path, 'rb') as f:
                output = f.read()
        else:
            output = f"Log file not found at {log_path}. Current dir: {os.getcwd()}".encode('utf-8')
        response_headers = [('Content-type', 'text/plain'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]

    try:
        _django_app = get_wsgi_application()
        return _django_app(environ, start_response)
    except Exception:
        import logging
        logger = logging.getLogger(__name__)
        logger.error("Failed to get WSGI application", exc_info=True)
        
        status = '500 Internal Server Error'
        output = b"CRITICAL ERROR DURING STARTUP:\n\n" + traceback.format_exc().encode('utf-8')
        response_headers = [('Content-type', 'text/plain'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]
