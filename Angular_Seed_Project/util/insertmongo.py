import pymongo
import csv
import json
import base64

from pymongo import MongoClient
client = MongoClient()

db = client['intra-cs']

collection = db.contacts

f = open('skills.csv', newline='')
csv_f = csv.reader(f, dialect='excel', delimiter=';')

people = []
basic_tools = []
inter_tools = []
advanced_tools = []

for row in csv_f:
    worktool = row[0]
    index = 1
    while index < 4:
        if row[index] != "":
            if not row[index] in people:
                people.append(row[index])
                basic_tools.append([])
                inter_tools.append([])
                advanced_tools.append([])
            if index == 1: basic_tools[people.index(row[index])].append(worktool)
            elif index == 2: inter_tools[people.index(row[index])].append(worktool)
            elif index == 3: advanced_tools[people.index(row[index])].append(worktool)
            else: print("Deu ruim em algo!")
        index = index + 1

### ================================================================================== ###

f = open('fotos.csv', newline='')
csv_f = csv.reader(f, dialect='excel', delimiter=';')

for row in csv_f:
    if row[0] != "":
        data = {}
        data['nome'] = row[0]
        data['sobre'] = "Conte sua vida aqui!"
        tooltable = {}
        name_stub = " " + row[0] ### Na planilha de habilidades, todos os nomes começam com espaço
        if name_stub in people:
            tooltable['tools_basic'] = basic_tools[people.index(name_stub)]
            tooltable['tools_intermediate'] = inter_tools[people.index(name_stub)]
            tooltable['tools_advanced'] = advanced_tools[people.index(name_stub)]
        data['tooltable'] = tooltable
        if row[1] != "": data['mail'] = row[1]
        else: data['mail'] = "Desconhecido"
        if row[2] != "": data['telefone'] = row[2]
        else: data['telefone'] = "Desconhecido"
        data['skype'] = "Desconhecido"
        if row[3] != "":
            filename = row[3] + ".png"
            with open(filename, "rb") as image_file:
                imagedata = base64.b64encode(image_file.read())
                data['imagem'] = "data:image/png;base64," + imagedata.decode('UTF-8')
        else: data['imagem'] = "Desconhecido"
##      json_data = json.dumps(data)
        collection.insert_one(data)

print("Inserção no banco completa!")
