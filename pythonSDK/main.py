import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_secret"))
app = firebase_admin.initialize_app(cred)


db = firestore.client()

# Start listing users from the beginning, 1000 at a time.
def listar_users():
    page = auth.list_users()
    while page:
        for user in page.users:
            print('User: ' + user.uid, user.email, user.display_name)
        # Get next batch of users.
        page = page.get_next_page()

def listar_atividade(user_email: str):
    users = db.collection("atividade").where("user_email", "==", user_email).order_by("datahora", 'DESCENDING').get()
    return [(x.id, x.to_dict()) for x in users] 
    

if __name__ == "__main__":
    listar_users()
    dados = listar_atividade("lfbossa@gmail.com")
    for id, reg in dados:
        reg["datahora"] = datetime.fromtimestamp(reg["datahora"].timestamp()).strftime("%x %X")

    print(dados)