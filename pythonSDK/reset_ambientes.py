import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from datetime import datetime
import json 
from dotenv import load_dotenv
from random import randint
import os


load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_secret"))
app = firebase_admin.initialize_app(cred)


db = firestore.client()
 
COLLECTIONS_MAP = [
    ('ambientes', 'json/ambientes.json', 'codigo'), 
    ('items', 'json/permanentes.json', 'key')
]



def load_json_file(filename):
    with open(filename) as fp:
        content = json.load(fp)
    return content

def unique_ambientes():
    ambientes = load_json_file('json/ambientes.json')
    ambientes = [a['codigo'] for a in ambientes]
    return sorted(list(set(ambientes)))

if __name__ == "__main__":
    unique_ambientes = unique_ambientes() 
    db.document('agregados/ambientes').update({'codigos': unique_ambientes})