import pymongo
import csv
import json
import base64

from pymongo import MongoClient
client = MongoClient()

db = client['intra-cs']

collection = db.contacts

f = open('fotos.csv', newline='')
csv_f = csv.reader(f, dialect='excel', delimiter=';')

for row in csv_f:
    if row[0] != "":
        data = {}
        data['nome'] = row[0]
        if row[1] != "": data['mail'] = row[1]
        else: data['mail'] = "Desconhecido"
        if row[2] != "": data['telefone'] = row[2]
        else: data['telefone'] = "Desconhecido"
        if row[3] != "":
            filename = row[3] + ".png"
            with open(filename, "rb") as image_file:
                imagedata = base64.b64encode(image_file.read())
                data['imagem'] = "data:image/png;base64," + imagedata.decode('UTF-8')
        else: data['imagem'] = "Desconhecido"
        json_data = json.dumps(data)
        collection.insert_one(data)

print("Inserção no banco completa!")
