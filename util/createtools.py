import csv
import json

f = open('skills.csv', newline='')
csv_f = csv.reader(f, dialect='excel', delimiter=';')

pt = open('tools.json','w')

tools = []

pt.write('[\n')
for row in csv_f:
    worktool = row[0].lower().replace("®", "").replace("™", "").replace("® ", " ").replace("™ ", " ").replace(" ", "-")
    if not worktool in tools:
        tools.append(worktool)
        pt.write('\t{ \"worktool\": \"' + worktool + '\", \"name\": \"' + row[0] + '\" },\n')
pt.write(']')
pt.close()

print("Inserção no banco completa!")
