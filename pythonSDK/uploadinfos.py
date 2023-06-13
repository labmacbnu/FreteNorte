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
    


def batch_write(collection: str, dictarray: list[dict], key_id: str | None = None):
    batch = db.batch()
    collection_ref = db.collection(collection)
    k = 1
    for i in range(0, len(dictarray), 500):
        chunk = dictarray[i:i+500]
        for document in chunk:
            if key_id:
                doc_ref = collection_ref.document(document[key_id])
                batch.set(doc_ref, document)
        print(f"{collection}: chunk {k} ({len(chunk)} documents)")
        k += 1
        batch.commit()

if __name__ == "__main__":
    for col, file, key in COLLECTIONS_MAP:
        dados = load_json_file(file)
        if col == 'items':  
            process_permanentes(dados)

        batch_write(col, dados, key )
