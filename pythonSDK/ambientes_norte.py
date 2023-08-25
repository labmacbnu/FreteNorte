# %%
import pandas as pd
from pathlib import Path

# %%
SOURCE = Path("xlsx/norte/ambientes_salto.xlsx")

# %%
df = pd.read_excel(SOURCE, skiprows=1, usecols="B:Z")

# %%
df = df[~df.Código.isna()]

# %%
df.drop(columns=df.columns[15:], inplace=True)

# %%
def rewrite_columns(string):
    replacing = [(" ", "_"), ("ã", "a"), ("á", "a"), ("õ", "o"), ("²", ""), ("ç", "c"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u"), ("(", ""), (")", ""), ("%", "")]
    for pair in replacing:
        string = string.replace(pair[0], pair[1])
    return string.lower()


df.columns = [rewrite_columns(x) for x in df.columns]

# %%
ambientes_origem = [x for x in df.columns if 'ambiente_origem' in x]

df["origem"] =  df[ambientes_origem].apply(lambda x: [ amb.split(' - ')[0] for amb in x.values if type(amb) == str ], axis=1)

df.drop(columns=ambientes_origem, inplace=True)
 
# %%
dicionarios = df.to_dict('records')

# %%
registros = []

for item in dicionarios:
    key = item.pop('codigo')
    nome = item.pop('nome')
    origem = item.pop('origem')
    registros.append({
        'nome': nome,
        'origem': origem,
        'codigo': key,
        'campus': "Norte",
        'detalhes':  item})

# %%
import json 

OUTPUT_PATH = Path("json") / "ambientes-norte.json"

with open(OUTPUT_PATH, "w") as fP:
    json.dump(registros, fP, indent=2, ensure_ascii=False)



