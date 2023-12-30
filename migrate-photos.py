import base64
import sqlite3

con = sqlite3.connect("prod.db")

cur = con.cursor()

for row in cur.execute("SELECT * FROM photos"):
    # id, portfolioEntryId, name, originalname, bytes, encoding, mimetype, size, createdAt, updatedAt
    filebytes = row[4]
    path = row[10]
    print("id: {0}, name: {1}, originalname: {2}, path: {3}".format(row[0], row[2], row[3], path))
    with open("uploads/{0}".format(row[2]), "wb") as file:
        file.write(base64.b64decode(filebytes))

cur.execute("UPDATE photos SET path = 'uploads/' || name")
con.commit()


