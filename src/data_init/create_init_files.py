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

pe_data = './psql/pe_data_remap.psql'


class BackupData:

    def __init__(self):
        pass

    def RunInit(self):
        x = CreateSqlJson(pe_data)
        for i in range(0, len(x)):
            print(x[i]['name'])
            nx  = x[i]['name']
            sql_query = x[i]['query']
            if nx != 'user_org_permission':
                continue

            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(sql_query)
            row = cur.fetchone()
            print( row )


    def LoadJson(self):
        pass

    def BuildJsonFiles(self):
        file_path = output_path +  str( date.today() ) + '/'
        mkdir(file_path)
        for table_name in tables:
            print(table_name)
            rows = self.RunPull(table_name)
            self.WriteJsonBackup(rows,table_name)

        for x in full_query_list:
            fname = x[0]
            print(fname)
            sql_query = x[1]
            rows = self.RunQuery(sql_query)
            self.WriteJsonBackup(rows,fname)

        #run sepearte queries
    def RunQuery(self, sql_query):
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql_query)
        rows = cur.fetchall()
        for row in rows:
            row['updated_at'] = str(row['updated_at'])
            if 'effective_date' in row:
                row['effective_date'] = str(row['effective_date'])
        return rows

    def RunPull(self, table_name):
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql_query = "SELECT * From {table_name}".format(table_name = table_name)
        cur.execute(sql_query)
        rows = cur.fetchall()
        for row in rows:
            row['created_at'] = str(row['created_at'])
            row['updated_at'] = str(row['updated_at'])
            if 'effective_date' in row:
                row['effective_date'] = str(row['effective_date'])
        return rows

    def WriteJsonBackup(self, rows, table_name):
        fileName = output_path +  str( date.today() ) + '/' + table_name + '.json'
        with open(fileName, 'w') as fp:
            json.dump( [ ix for ix in rows], fp, indent=4)

    def WriteSqlFile(self, rwos, table_name ):
        pass


if __name__ == "__main__":
    x = BackupData()
    x.RunInit()