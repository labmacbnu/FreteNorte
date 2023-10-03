import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from datetime import datetime
from dotenv import load_dotenv
import os
import json

load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_secret"))
app = firebase_admin.initialize_app(cred)


db = firestore.client()

# Start listing users from the beginning, 1000 at a time.
def listar_usuarios_autenticados():
    page = auth.list_users()
    USUARIOS = []
    while page:
        for user in page.users:
            USUARIOS.append(user)
        # Get next batch of users.
        page = page.get_next_page()
    return USUARIOS


def lista_usuarios_cadastrados():
    userbase = {}
    usuarios = db.collection("usuarios")
    for doc in usuarios.stream():
        dados = doc.to_dict()
        userbase[doc.id] = dados
    return userbase

def load_json_file(filename):
    with open(filename) as fp:
        content = json.load(fp)
    return content


def get_lideres():
    return load_json_file("json0914/lideres.json")
    

if __name__ == "__main__":
    lista_logados = listar_usuarios_autenticados()
    lista_cadastrados = lista_usuarios_cadastrados()
    lideres = get_lideres()
    LOGADOS = 0
    for user in lista_logados:
        if user.email in lideres:
            print(user.email)
            LOGADOS += 1
    print(f"{LOGADOS} de {len(lideres)} ({LOGADOS/len(lideres)*100:.2f}%)")


