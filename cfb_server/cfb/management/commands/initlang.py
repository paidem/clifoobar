from django.core.management import BaseCommand

from cfb import models

LANGUAGES = [
    {'code': 'accesslog', 'name': 'accesslog'},
    {'code': 'apache', 'name': 'apache'},
    {'code': 'autohotcode', 'name': 'autohotcode'},
    {'code': 'bash', 'name': 'Bash'},
    {'code': 'cpp', 'name': 'C++'},
    {'code': 'cs', 'name': 'C#'},
    {'code': 'dockerfile', 'name': 'dockerfile'},
    {'code': 'dos', 'name': 'dos'},
    {'code': 'go', 'name': 'go'},
    {'code': 'java', 'name': 'Java'},
    {'code': 'javascript', 'name': 'JavaScript'},
    {'code': 'json', 'name': 'JSON'},
    {'code': 'kotlin', 'name': 'kotlin'},
    {'code': 'less', 'name': 'LESS'},
    {'code': 'markdown', 'name': 'markdown'},
    {'code': 'nginx', 'name': 'nginx'},
    {'code': 'objectivec', 'name': 'objectivec'},
    {'code': 'pgsql', 'name': 'pgsql'},
    {'code': 'php', 'name': 'php'},
    {'code': 'plainname', 'name': 'plainname'},
    {'code': 'properties', 'name': 'properties'},
    {'code': 'powershell', 'name': 'PowerShell'},
    {'code': 'python', 'name': 'Python'},
    {'code': 'ruby', 'name': 'Ruby'},
    {'code': 'scss', 'name': 'SCSS'},
    {'code': 'shell', 'name': 'Shell'},
    {'code': 'sql', 'name': 'SQL'},
    {'code': 'swift', 'name': 'Swift'},
    {'code': 'name', 'name': 'name'},
    {'code': 'typescript', 'name': 'Typescript'},
    {'code': 'vbnet', 'name': 'VB.Net'},
    {'code': 'vbscript', 'name': 'VBscript'},
    {'code': 'xml', 'name': 'XML'},
    {'code': 'yaml', 'name': 'Yaml'},
]


class Command(BaseCommand):

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)

    help = "Create default languages"

    def handle(self, *args, **options):
        pass