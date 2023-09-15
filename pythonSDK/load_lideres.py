import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from datetime import datetime
import json 
from dotenv import load_dotenv
from random import randint
import os
import re
from unidecode import unidecode



load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_secret"))
app = firebase_admin.initialize_app(cred)


def load_json_file(filename):
    with open(filename) as fp:
        content = json.load(fp)
    return content

db = firestore.client()


LIDERES = load_json_file("json/lideres.json")


def load_usuarios():
    userbase = {}
    usuarios = db.collection("usuarios")
    for doc in usuarios.stream():
        dados = doc.to_dict()
        userbase[doc.id] = dados
    return userbase

USERBASE = load_usuarios()

def filtro_nome(pesquisa):
    def filtro(pair):
        email, dados = pair 
        if re.match(pesquisa, dados["nome"], re.I):
            return True
        else:
            return False 
    return filtro

def find_usuario(nome):
    regex_nome = nome.replace(".", ".*") 
    filtro = filtro_nome(regex_nome)
    return dict( filter( filtro, USERBASE.items() ) )

def confirmar(nome_lider, user_nome):
    resposta = input(f"Confirma que {nome_lider} é {user_nome}?")
    return resposta != "N"

if __name__ == "__main__":
    N = len(LIDERES)
    M = 0
    for email_lider in LIDERES.keys():
        if email_lider in USERBASE:  
            M += 1 

    print(f"Total de líderes de ambientes: {N}")
    print(f"Total de líderes logados: {M}")