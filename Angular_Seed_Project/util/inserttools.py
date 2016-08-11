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
    
for name_stub in people:
    tooltable = {}
    tooltable['tools_basic'] = basic_tools[people.index(name_stub)]
    tooltable['tools_intermediate'] = inter_tools[people.index(name_stub)]
    tooltable['tools_advanced'] = advanced_tools[people.index(name_stub)]
    temp_mail = name_stub + "@certsys.com.br"
    collection.update_one(
        {"mail": temp_mail},
        {
            "$set": {
                "tooltable": tooltable
            }
        }
    )
    alt_mail = name_stub + "@csconsulting.com.br"
    collection.update_one(
        {"mail": alt_mail},
        {
            "$set": {
                "tooltable": tooltable
            }
        }
    )
print("Atualização no banco completa!")
