import pyodbc
import os
import config
pe  = config.pe
edw = config.edw

# file_name = 'output.txt'
# output_path = "./pe_output.xlsx"
psql_conn = "dbname={dbname} user={user} host='{server}' password='{password}'".format(
    dbname=pe['database'], user=pe['user'], server=pe['server'], password=pe['password']
)

conn = psycopg2.connect()

pe_npi = {}

cnxn_str = ("Driver={SQL Server Native Client 11.0};"
            "Server={server};"
            "Database={database};"
            "UID={user};"
            "PWD={password};").format(server=edw['server'], user=edw['user'], password=edw['password'], database=['database'])

cnxn = pyodbc.connect(cnxn_str)

cursor = cnxn.cursor()
rows = cursor.execute("Select 1 as x, 2 as y").fetchall()
print(rows)