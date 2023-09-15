import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from datetime import datetime
import json 
from dotenv import load_dotenv
from random import randint
import os
import re
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_secret"))
app = firebase_admin.initialize_app(cred)


db = firestore.client()


def load_json_file(filename):
    with open(filename) as fp:
        content = json.load(fp)
    return content

LIDERES = load_json_file("json/lideres.json")


def insere_lider(email, data): 
    usuarios_ref = db.collection("usuarios")
    user_ref = usuarios_ref.document(email)
    user = user_ref.get()
    if user.exists:
        print(f"{bcolors.OKBLUE}Usuário <{email}> já está cadastrado.{bcolors.ENDC}")
    else:
        user_ref.set(data)
        print(f"{bcolors.WARNING}Inserindo <{email}>.{bcolors.ENDC}")
        for amb in data["ambientes"]:
            update_ambiente(amb, user_ref)
    update_liderados(data["ambientes"])

def update_ambiente(amb: str, lider):
    ambiente_ref = db.collection("ambientes").document(amb)
    ambiente = ambiente_ref.get()
    if ambiente.exists:
        ambiente_ref.update({"lider": lider})
        print(f"{bcolors.BOLD}\tAmbiente {amb} atualizado.{bcolors.ENDC}")
    else:
        print(f"{bcolors.FAIL}\tAmbiente {amb} não existe.{bcolors.ENDC}")


def update_liderados(lista_ambientes: list):
    agregados_ref = db.collection("agregados").document("ambientes")
    agregados_ref.update({"liderados": firestore.ArrayUnion(lista_ambientes)})
    print(f"Ambientes liderados {lista_ambientes}")
    

if __name__ == "__main__":
    print(f"Total de líderes {len(LIDERES)}")
    for email, valores in LIDERES.items():
        if re.match(r"\S*@ufsc.br", email):
            insere_lider(email, valores)
        else:
            print(f"{bcolors.FAIL}{email} inválido.{bcolors.ENDC}" )