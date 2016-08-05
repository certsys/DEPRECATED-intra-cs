def is_empty(any_structure):
    if any_structure:
        return False
    else:
        return True

import pymongo
import csv
import json
import base64

from pymongo import MongoClient
client = MongoClient()

db = client['intra-cs']

collection = db.contacts

f = open('skills.csv', encoding='mac-roman', newline='')
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
            if index == 1: basic_tools[people.index(row[index])].append(worktool.replace("Æ†","® ").replace("Æ","®").replace("ô","™").replace("†e", "e").replace("†", " "))
            elif index == 2: inter_tools[people.index(row[index])].append(worktool.replace("Æ†","® ").replace("Æ","®").replace("ô","™").replace("†e", "e").replace("†", " "))
            elif index == 3: advanced_tools[people.index(row[index])].append(worktool.replace("Æ†","® ").replace("Æ","®").replace("ô","™").replace("†e", "e").replace("†", " "))
            else: print("Deu ruim em algo!")
        index = index + 1

f = open('fotos.csv', encoding='mac-roman', newline='')
csv_f = csv.reader(f, dialect='excel', delimiter=';')

for row in csv_f:
    if row[3] != "":
        tooltable = {}
        name_stub = row[3]
        if name_stub in people:
            tooltable = {}
            tooltable['tools_basic'] = basic_tools[people.index(name_stub)]
            tooltable['tools_intermediate'] = inter_tools[people.index(name_stub)]
            tooltable['tools_advanced'] = advanced_tools[people.index(name_stub)]
        else: tooltable = {}
        if row[3] != "":
            filename = row[3] + ".png" 
            with open(filename, "rb") as image_file:
                imagedata = base64.b64encode(image_file.read())
                finalimage = "data:image/png;base64," + imagedata.decode('UTF-8')
        else: finalimage = ""
        temp_mail = name_stub + "@certsys.com.br"
        collection.update_one(
            {"mail": temp_mail},
            {
                "$set": {
                    "tooltable": tooltable,
                    "imagem": finalimage
                }
            }
        )
print("Atualização no banco completa!")
