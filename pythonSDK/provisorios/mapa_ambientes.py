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
3	0	E
4	0	E
5	0	D
6	0	D
7	0	D
12	0	E
13	0	D
14	0	D
15	0	D
16	0	E
17	0	E
103	1	E
104	1	E
105	1	D
106	1	D
107	1	D
111	1	E
112	1	E
113	1	D
114	1	D
115	1	D
116	1	E
118	1	E
119	1	E
"""

data_dict = {}
for line in mapping.strip().split("\n"):
    key, value = line.split("\t")
    data_dict[key] = value

provisorios = {}
for line in properties.strip().split("\n"):
    sala, andar, lado = line.split("\t")
    provisorios[sala] = {
        "andar": int(andar),
        "lado": lado
    }

PROVISORIOS = {
    "alocacoes": data_dict,
    "ambientes": provisorios
}
import json 
print(json.dumps(PROVISORIOS, indent=4))

with open("provisorios.json", "w") as f:
    json.dump(PROVISORIOS, f, indent=4, ensure_ascii=False)
