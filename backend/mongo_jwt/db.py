from pymongo import MongoClient
from django.conf import settings
import urllib.parse

MANGO_JWT_SETTINGS = settings.MANGO_JWT_SETTINGS


db_host_mongo = MANGO_JWT_SETTINGS['db_host']
db_name = MANGO_JWT_SETTINGS['db_name']
if 'db_port' in MANGO_JWT_SETTINGS:

    password = urllib.parse.quote(MANGO_JWT_SETTINGS['db_pass'])
    username = urllib.parse.quote(MANGO_JWT_SETTINGS['db_user'])
    db_port_mongo = MANGO_JWT_SETTINGS['db_port']
    mongo_uri = "mongodb://{username}:{password}@{db_host}:{db_port_mongo}/{db_name}?retryWrites=true&w=majority".format(
        username=username, password=password, db_host=db_host_mongo,
        db_port_mongo=db_port_mongo, db_name=db_name)
elif "mongodb" in db_host_mongo:
    mongo_uri = db_host_mongo
else:
    password = urllib.parse.quote(MANGO_JWT_SETTINGS['db_pass'])
    username = urllib.parse.quote(MANGO_JWT_SETTINGS['db_user'])
    mongo_uri = "mongodb+srv://{username}:{password}@{host}/{db_name}".format(
        username=username, password=password, host=db_host_mongo, db_name=db_name)

client = MongoClient(mongo_uri)
database = client[db_name]

auth_collection = MANGO_JWT_SETTINGS['auth_collection'] if 'auth_collection' in MANGO_JWT_SETTINGS else "user_profile"

fields = MANGO_JWT_SETTINGS['fields'] if 'fields' in MANGO_JWT_SETTINGS else ()

jwt_secret = settings.JWT_SECRET if settings.JWT_SECRET else 'secret'

jwt_life = MANGO_JWT_SETTINGS['jwt_life'] if 'jwt_life' in MANGO_JWT_SETTINGS else 7

secondary_username_field = MANGO_JWT_SETTINGS['secondary_username_field'] if 'secondary_username_field' in MANGO_JWT_SETTINGS and MANGO_JWT_SETTINGS['secondary_username_field'] != 'email' else None

id_field = MANGO_JWT_SETTINGS['id_field'] if 'id_field' else 'email'
