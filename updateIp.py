import urllib
import urllib2
import socket
import time
from uuid import getnode as get_mac
import json

baseAddress = "http://10.20.105.34:3000/"

while True:
    try:
        mac = get_mac()
        # ip = socket.gethostbyname(socket.gethostname())
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('google.com', 0))
        ip = s.getsockname()[0]+":9000"
        url = baseAddress+'updateIp'
        f = open('credentials.json', 'r')
        data = json.loads(f.read())
        values = {'id': data['id'],
                  'title': data['name'],
                  'mac': mac,
                  'ip': ip
                  }
        data = urllib.urlencode(values)
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        response = response.read()

        print response

    except Exception as e:
        print 'error: '
        print e

    time.sleep(10)
