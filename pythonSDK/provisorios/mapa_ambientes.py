mapping = """
C103	112
C104	3
C105.3	5
C105.2	17
C105.1	16
C106	6
C106	12
C107	3
C204.1	14
C206	113
C306	17
C308	13
C401	7
C402	112
C101	114
C102	115
C201	105
C202	4
C203	106
C204	15
C205	107
C301	118
C302	116
C303	103
C304	104
C305	111
C306	119
"""

properties = """
5	0	D	lime
6	0	D	orange
7	0	D	gray
13	0	D	green
14	0	D	navy
15	0	D	pink
3	0	E	lime
4	0	E	orange
12	0	E	gray
16	0	E	green
17	0	E	navy
105	1	D	lime
106	1	D	orange
107	1	D	gray
113	1	D	green
114	1	D	navy
115	1	D	pink
103	1	E	lime
104	1	E	orange
111	1	E	gray
112	1	E	green
116	1	E	navy
118	1	E	pink
119	1	E	brown
"""

data_dict = {}
for line in mapping.strip().split("\n"):
    key, value = line.split("\t")
    data_dict[key] = value

provisorios = {}
for line in properties.strip().split("\n"):
    sala, andar, lado, cor2 = line.split("\t")
    provisorios[sala] = {
        "andar": int(andar),
        "lado": lado,
        "cor": cor2
    }

PROVISORIOS = {
    "alocacoes": data_dict,
    "ambientes": provisorios
}
import json 
print(json.dumps(PROVISORIOS, indent=4))

with open("provisorios.json", "w") as f:
    json.dump(PROVISORIOS, f, indent=4, ensure_ascii=False)
