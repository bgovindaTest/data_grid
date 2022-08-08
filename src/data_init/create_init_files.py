"""
This file creates a backup of all tables in postgres provider effort database.
Exports them as json and csv (or some other delimiter)
"""
import json
import psycopg2
import psycopg2.extras
from datetime import date
import os

import sys
sys.path.append('/home/bgovi/PsqlCred')
import psql_cred
from parse_sql_json import CreateSqlJson


input_connect_string   = psql_cred.input_connect_string
output_path = '/home/bgovi/PsqlCred/output_data'
conn = psycopg2.connect(input_connect_string)

pe_data    = './psql/pe_data_remap.psql'
admin_data = './psql/admin_data_remap.psql'

sql_out = output_path +'/sql/'
json_out = output_path +'/json_out/'
def mkdir(path):
    try:
        os.mkdir(path)
    except:
        pass

mkdir(sql_out)
mkdir(json_out)

class BackupData:

    def __init__(self):
        pass

    def RunInit(self):
        self.RunFile('admin', admin_data)
        self.RunFile('provider_effort', pe_data)

    def RunFile(self, schema_name, file_path):
        x = CreateSqlJson(file_path)
        for i in range(0, len(x)):
            table_name = x[i]['name']
            sql_query = x[i]['query']
            print(table_name)
            full_name = schema_name +'.'+table_name
            rows = self.RunQuery(sql_query)
            self.WriteSqlFile(rows, full_name)
            self.WriteJsonFile(rows, full_name)

        #run sepearte queries
    def RunQuery(self, sql_query):
        # print(sql_query)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql_query)
        rows = cur.fetchall()
        return rows

    def WriteJsonFile(self, rows, table_name):
        fileName = json_out + table_name + '.json'
        with open(fileName, 'w') as fp:
            json.dump( [ ix for ix in rows], fp, indent=4)

    def WriteSqlFile(self, rows, table_name ):
        columns = self.RowColumns(rows[0])
        insert_str = "INSERT INTO {table_name} ( {columns} ) VALUES\n".format(columns = ','.join(columns), table_name = table_name)
        values = []
        for row in rows:
            values.append(self.RowValues(row, columns))
        val_str = ',\n'.join(values)
        fileName = sql_out + table_name + '.psql'
        f = open(fileName, 'w')
        f.writelines([insert_str, val_str, ';'])
        f.close()

    def RowColumns(self, row):
        return list(row.keys() )

    def RowValues(self, row, columns):
        values = []
        for cx in columns:
            x = "$${value}$$".format(value=str(row[cx])).replace("$$None$$", "NULL")
            values.append(x)
        return "( {values} )".format(values=','.join(values))

if __name__ == "__main__":
    x = BackupData()
    x.RunInit()