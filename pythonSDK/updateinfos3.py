import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from datetime import datetime
import json
import time
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_secret"))
app = firebase_admin.initialize_app(cred)


db = firestore.client()


COLLECTIONS_MAP = [
    ('ambientes', 'json/ambientes.json', 'ambiente_codigo'),
    ('edificios', 'json/edificios.json', 'edificio_codigo'),
    ('items', 'json/permanentes.json', 'key')
]


def load_json_file(filename):
    with open(filename) as fp:
        content = json.load(fp)
    return content

def process_permanentes(permanentes_array: list[dict]):
    for x in permanentes_array:
        for key in ["patrimonio", "n_controle" ]:
            try:
                x[key] = str(int(x[key]))
            except TypeError:
                x[key] = None
        
        x["key"] = x["patrimonio"] if x["patrimonio"] else x["n_controle"]

        for key in ["incorporacao", "transf_local"]:  
            try:
                x[key] = datetime.fromisoformat(x[key]) 
            except ValueError:
                x[key] = None

def update_ambientes(lista): 
    collection_ref = db.collection('agregados')
    doc_ref = collection_ref.document("ambientes")
    return doc_ref.set({'codigos': lista})


from collections import Counter

if __name__ == "__main__":
    col, file, key = COLLECTIONS_MAP[2]
    dados = load_json_file(file)  
    for elem in dados:
        key = elem["patrimonio"] if elem["patrimonio"] else elem["n_controle"]
        key = str(int(key))
        print(key, type(key)) 
        uptime = db.collection("items").document(key).update({
            "fragil": False, "especial": False, "inteiro": True
            })
        print(uptime)
        
