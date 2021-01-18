import bcrypt
from django.conf import settings


def hash(password):
    return bcrypt.hashpw(password, bcrypt.gensalt())

def check_hash(passw,hash):
    try:
        if bcrypt.hashpw(passw, hash) == hash:
            return True
        else:
            return False
    except:
        return False