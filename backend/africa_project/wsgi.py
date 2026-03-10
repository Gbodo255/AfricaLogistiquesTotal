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

try:
    application = get_wsgi_application()
except Exception:
    import logging
    logger = logging.getLogger(__name__)
    logger.error("Failed to get WSGI application", exc_info=True)
    
    # Simple error app for debugging
    def application(environ, start_response):
        status = '500 Internal Server Error'
        output = b"CRITICAL ERROR DURING STARTUP:\n\n" + traceback.format_exc().encode('utf-8')
        response_headers = [('Content-type', 'text/plain'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]
