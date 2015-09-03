import urllib
import urllib2
import socket
import time
from uuid import getnode as get_mac
import json

while True:
    try:
        mac = get_mac()
        ip = socket.gethostbyname(socket.gethostname())
        url = 'http://localhost:3000/updateIp'
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
