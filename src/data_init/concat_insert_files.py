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

pe_data    = '/home/bgovi/Workspace/MultiGrid/data_grid/src/data_init/psql/pe_data_remap.psql'
admin_data = '/home/bgovi/Workspace/MultiGrid/data_grid/src/data_init/psql/admin_data_remap.psql'

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
        out_list = []
        self.RunFile('app_admin', admin_data, out_list)
        self.RunFile('provider_effort', pe_data, out_list)
        f = open(sql_out + 'all_data.psql', 'w')
        outStr = '\n'.join( out_list )
        f.write(outStr)
        f.close()

    def RunFile(self, schema_name, file_path, out_list):
        x = CreateSqlJson(file_path)
        for i in range(0, len(x)):
            table_name = x[i]['name']
            if table_name == "full_org":
                continue

            print(table_name)
            full_name = schema_name +'.'+table_name
            file_path = sql_out + full_name +'.psql'
            self.ReadSqlFile(file_path, out_list)

    def ReadSqlFile(self, file_path, out_list):
        f = open(file_path, "r")
        out_list.append( f.read() )
        f.close()

if __name__ == "__main__":
    x = BackupData()
    x.RunInit()