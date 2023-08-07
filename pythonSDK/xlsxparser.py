# %%
import pandas as pd
import numpy as np
from pathlib import Path
import re
import json
# %%
FONTE = Path("./xlsx/")
DESTINO = Path("./json/")

# %%
DATAFRAMES = {x.stem: pd.read_excel(x) for x in FONTE.glob("*.xls") }

# %%
def ambiente_parser(string):
    ambiente = string.replace("Ambiente:", "")
    return [e.strip(" ") for e in ambiente.split("-", 1)]
# %%
def find_ambiente(string: str):
    if isinstance(string, str):
        if string.startswith("Ambiente"):
            #print(string)
            return string
    else:
        return None

# %%
for name, DF in DATAFRAMES.items():
    rows, cols = DF.shape 
    DF["edificio"] = DF.iloc[3,3] 


# %%
FULL_DF = pd.concat(DATAFRAMES, ignore_index=True)
print(FULL_DF)
# %%

# %%
AMBIENTES_ROWS = {}
AMBIENTES_EDIFICIOS = {}

for n, x in FULL_DF.iloc[:,0].items():
    ambiente = find_ambiente(x)
    AMBIENTES_ROWS[ambiente] = n
    if ambiente:
      [cod, nome] = ambiente_parser(x)
      AMBIENTES_EDIFICIOS[cod] = FULL_DF.loc[n,"edificio"]

FULL_DF.drop(columns=["edificio"], inplace=True)

AMBIENTES_EDIFICIOS

# %%
AMBIENTES_RANGES = {}

CHAVES = list(AMBIENTES_ROWS.keys())
CHAVES.pop(0)

for antes, depois in zip(CHAVES, CHAVES[1:]): 
    AMBIENTES_RANGES[antes] =  (AMBIENTES_ROWS[antes], AMBIENTES_ROWS[depois])
AMBIENTES_RANGES[CHAVES[-1]] = (AMBIENTES_ROWS[CHAVES[-1]], AMBIENTES_ROWS[None])
AMBIENTES_RANGES
# %%

AMBIENTES_DF = []

for amb, rng in AMBIENTES_RANGES.items():
    a,b = rng
    print(a, b, amb, sep="\t|\t")
    if a < b:
        valores = FULL_DF.iloc[a+1:b-1,:].values
    else:
        valores = FULL_DF.iloc[a+1:,:].values
    
    new_df = pd.DataFrame(valores[1:], columns=valores[0]) 
    new_df = new_df[[x for x in new_df.columns if type(x) == str]]
    novas_colunas = new_df.columns.values  
    new_df.columns = novas_colunas
    new_df["Ambiente"] = amb
    AMBIENTES_DF.append(new_df)

AMBIENTES_DF
# %%
PERMANENTES = pd.concat(AMBIENTES_DF, ignore_index=True)
PERMANENTES

# %%
def check_patrimonio(value):
    try: 
        n = int(value)
        return n
    except:
        return None
 

# %%
PERMANENTES.columns = ["patrimonio", "n_controle", "cod_barras", "n_serie",
              "descricao", "responsavel", "conservacao", "incorporacao", "transf_local",
              "valor", "situacao", "ambiente"]

PERMANENTES = PERMANENTES[~PERMANENTES.situacao.isna()]

PERMANENTES["short_descricao"] = PERMANENTES.descricao.apply(lambda x: x.split(" - ", 1)[0])


AMBIENTES = PERMANENTES.apply(lambda x: ambiente_parser(x.ambiente), axis=1, result_type="expand")
AMBIENTES.columns = ["ambiente_codigo", "ambiente_nome"]

AMBIENTES["edificio"] = AMBIENTES.ambiente_codigo.apply(lambda x: AMBIENTES_EDIFICIOS[x])

# %%
def edificio_parser(string):
    return [y.strip(" ") for y in string.split("-") ]
 


# %%

UNIQUE_AMBIENTES = pd.concat([AMBIENTES], axis=1).groupby(["edificio", "ambiente_codigo", "ambiente_nome"]).agg({"ambiente_nome": "count"})\
.rename(columns={"ambiente_nome": "items", "ambiente_codigo": "nome"}).reset_index()

UNIQUE_AMBIENTES.to_json(DESTINO / "ambientes.json", orient="records", indent=2)

# %%
def regex_extract(text: str, regex: str) -> str:
    match = re.search(regex, text, flags=re.IGNORECASE)
    if match:
        return match.group(0)
    return None

# %%
def regex_extract_all_matches(text: str, regex: str) -> list[str]:
    matches = re.findall(regex, text, flags=re.IGNORECASE)
    if len(matches) == 0:
        return None
    return "X".join(matches)

# %% 
peso = r"peso"
peso1 = r"peso\s*:*\s*(\d+,{0,1}\d*)\s*[K]*G"
peso3 = r"peso\s*:*\s*(\d+,{0,1}\d*)"
peso4 = r"(\d+,{0,1}\d*)\s*KG"

PESOS_COMPLEX_REGEXES = [  
    peso, 
    peso1,
    peso3,
    peso4
    
]

PESOS_SIMPLE_REGEXES = [ ]

# %%
PESOS = []
for regex in PESOS_COMPLEX_REGEXES:
    PESOS.append(PERMANENTES.descricao.apply(lambda x: regex_extract(x, regex)))

for regex in PESOS_SIMPLE_REGEXES:
    PESOS.append(PERMANENTES.descricao.apply(lambda x: regex_extract_all_matches(x, regex)))

# %%
PESOS_DF = pd.concat(PESOS, axis=1)
PESOS_DF.columns =  [f"regex_{x}" for x in range(1,len(PESOS_DF.columns)+1)]


colunas = PESOS_DF.columns

PESOS_DF["peso"] = ""

for index, series in  PESOS_DF[colunas].iterrows():
    tamanhos = series.apply(lambda x: len(x) if isinstance(x,str) else 0)
    coluna = np.argmax(tamanhos)
    best_tamanho = PESOS_DF.loc[index,colunas[coluna]] 
    if best_tamanho:
        PESOS_DF.loc[index, "peso"] = best_tamanho

# %% 
medidas3 = "X".join([r"\s*\d+,{0,1}\d*\s*"]*3)
medidas2 = "X".join([r"\s*\d+\s*"]*2)
medidas3p = "X".join([r"\s*\d+\s*[cm]m"]*3) 
medidas3Lp = "×".join([r"\s*\d+\s*\(\w\)\s*[cm]m"]*3) 

MEDIDAS_COMPLEX_REGEXES = [ 
    medidas3,
    medidas3 + "[cm]m",
    medidas2,
    medidas2 + "[cm]m",
    medidas3p,
    medidas3Lp
]

MEDIDAS_SIMPLE_REGEXES = [r"(\d+\s*[cm]m)"]

MEDIDAS = []
for regex in MEDIDAS_COMPLEX_REGEXES:
    MEDIDAS.append(PERMANENTES.descricao.apply(lambda x: regex_extract(x, regex)))

for regex in MEDIDAS_SIMPLE_REGEXES:
    MEDIDAS.append(PERMANENTES.descricao.apply(lambda x: regex_extract_all_matches(x, regex)))

MEDIDAS_DF = pd.concat(MEDIDAS, axis=1)
MEDIDAS_DF.columns =  [f"regex_{x}" for x in range(1,len(MEDIDAS_DF.columns)+1)]


colunas = MEDIDAS_DF.columns[1:]
MEDIDAS_DF["medidas"] = ""

for index, series in  MEDIDAS_DF[colunas].iterrows():
    tamanhos = series.apply(lambda x: len(x) if isinstance(x,str) else 0)
    coluna = np.argmax(tamanhos)
    best_tamanho = MEDIDAS_DF.loc[index,colunas[coluna]] 
    if best_tamanho:
        MEDIDAS_DF.loc[index, "medidas"] = best_tamanho


# %%
# EXPORTANDO O PRINCIPAL
BIG_DF = pd.concat([PERMANENTES, AMBIENTES, PESOS_DF.peso, MEDIDAS_DF.medidas], axis=1)
BIG_DF.columns

COLUMNS_MAPPING = {
    'patrimonio': 'detalhes.patrimonio', 
    'n_controle': 'detalhes.n_controle', 
    'cod_barras':  'detalhes.cod_barras', 
    'n_serie': 'detalhes.n_serie', 
    'descricao': 'detalhes.descricao',
    'conservacao': 'detalhes.conservacao', 
    'incorporacao': 'detalhes.incorporacao',
    'transf_local': 'detalhes.transf_local', 
    'valor':  'detalhes.valor',
    'situacao': 'detalhes.situacao', 
    'short_descricao': 'short_descricao', 
    'ambiente_codigo': 'ambiente',  
    'ambiente_nome': None,
    'peso': 'detalhes.peso',
    'medidas': 'detalhes.medidas'
}
from datetime import datetime

META = {
    'inteiro': True,
    'updated': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
    'partes': [],
    'volumado': False,
    'volume': None
}


JSON_RECORDS = BIG_DF.to_dict(orient="records")

for origin, destin in COLUMNS_MAPPING.items():
    for record in JSON_RECORDS:
        if destin:
          record[destin] = record.pop(origin)
        else:
          record.pop(origin)
        record['key'] = record['detalhes.patrimonio']
        if record['key'] == None:
            record['key'] = record['n_controle']
        record['meta'] = META

from functools import reduce

def dot_to_json(a):
    output = {}
    for key, value in a.items():
        path = key.split('.')
        if path[0] == 'json':
            path = path[1:]
        target = reduce(lambda d, k: d.setdefault(k, {}), path[:-1], output)
        target[path[-1]] = value
    return output


JSON_RECORDS = [dot_to_json(x) for x in JSON_RECORDS]

JSON_RECORDS


with open(DESTINO / "permanentes.json", "w") as f:
   json.dump(JSON_RECORDS, f, ensure_ascii=False, indent=2)


# %%
