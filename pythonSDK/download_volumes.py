# %%
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, auth
from firebase_admin.firestore import FieldFilter
from google.cloud.firestore_v1.document import DocumentReference
from datetime import datetime
import json 
from dotenv import load_dotenv 
from pathlib import Path
import os
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


# %%
def process_reference(reference: DocumentReference):
    return reference.path

def process_array(array: list):
    return [process_reference(item) if type(item) == DocumentReference else item for item in array]

def process_dict(input_dict):
    output_dict = {}
    for key, value in input_dict.items():
        if type(value) == DocumentReference:
            output_dict[key] = process_reference(value)
        elif isinstance(value, dict):
            output_dict[key] = process_dict(value)
        elif isinstance(value, list):
            output_dict[key] = process_array(value)
        elif isinstance(value, datetime):
            output_dict[key] = value.isoformat()
        else:
            output_dict[key] = value
    return output_dict

# %% [markdown]
# # Itens

# %%
def download_items():
    itens_stream = db.collection("items").stream()

    itens = {} 

    for item in itens_stream:
        itens[item.id] = process_dict(item.to_dict())
    return itens    


# %% [markdown]
# ```python
# import json
# with open("json1123/itens.json") as f:
#     itens = json.load(f)
# armarios_altos = filter(lambda x: x["short_descricao"] == "ARMÁRIO ALTO FECHADO", itens.values())
# armarios_altos = list(armarios_altos)
# for armario in armarios_altos: 
#     key = armario["key"]
#     itens[str(key)]["detalhes"]["medidas"] = '160 x 50 x 80 (AxCxL)'
# ```

# %%
def save_itens(itens, filename):
    with open(filename , "w") as fp:
        json.dump(itens, fp, indent=2, ensure_ascii=False) 

# %% [markdown]
# ## Volumes

# %%

def download_volumes():
    volumes_stream = db.collection("volumes").where(filter=FieldFilter("deleted", "==", False)).stream()

    volumes = {}

    for volume in volumes_stream:
        volumes[volume.id] = process_dict(volume.to_dict())
    return volumes



# %%
def save_volumes(volumes, filename):
    with open(filename, "w") as fp:
        json.dump(volumes, fp, indent=2, ensure_ascii=False) 

 

# %%
if __name__ == "__main__":
    hoje = datetime.now().isoformat()
    print(f"{bcolors.OKGREEN}Iniciando download às {hoje}{bcolors.ENDC}")
    file_end = hoje[:10]
    
    itens_file = Path(f"volumes/itens-{file_end}.json")
    volumes_file = Path(f"volumes/volumes-{file_end}.json")  
    #exit()
    print(f"{bcolors.OKGREEN}[{datetime.now()}]\tIniciando download dos itens.{bcolors.ENDC}")
    itens = download_items()
    print(f"{bcolors.OKGREEN}[{datetime.now()}]\tSalvando em {itens_file}{bcolors.ENDC}")
    save_itens(itens, itens_file )


    print(f"{bcolors.OKGREEN}[{datetime.now()}]\tIniciando download dos volumes.{bcolors.ENDC}")
    volumes = download_volumes()
    print(f"{bcolors.OKGREEN}[{datetime.now()}]\tSalvando em {volumes_file}{bcolors.ENDC}")
    save_volumes(volumes, volumes_file)