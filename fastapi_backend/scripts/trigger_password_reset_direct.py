import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from routes import password_reset, PasswordResetRequest
from db import SessionLocal

if __name__ == '__main__':
    db = SessionLocal()
    req = PasswordResetRequest(email='test+reset@example.com')
    res = password_reset(req, db=db)
    print('Endpoint returned:', res)
