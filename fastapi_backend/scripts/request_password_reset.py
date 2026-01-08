import json
import urllib.request

url = 'http://127.0.0.1:7004/api/auth/password-reset/'
email = 'test+reset@example.com'
data = json.dumps({'email': email}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req, timeout=10) as r:
    print('Response status:', r.status)
    print(r.read().decode())
