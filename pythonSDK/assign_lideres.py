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

usuarios = db.collection("usuarios")
for doc in usuarios.stream():
    dados = doc.to_dict()
    user_ref = db.document(f"usuarios/{doc.id}")
    for amb in dados["ambientes"]:
        amb_ref = db.document(f"ambientes/{amb}")
        amb_ref.update({"lider": user_ref})