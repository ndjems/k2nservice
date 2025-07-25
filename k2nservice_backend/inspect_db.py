import sqlite3

conn = sqlite3.connect("k2n.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tables dans la base :", tables)