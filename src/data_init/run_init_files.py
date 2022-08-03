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
sys.path.append('~/PsqlCred')
import psql_cred

output_connect_string = psql_cred.output_connect_string
#create files?

output_path = '~/PsqlCred/output_data'

conn = psycopg2.connect(output_connect_string)


full_query_list = [ ('one_minus_full', one_minus_full), ('time_based_full', time_based_full)]

class BackupData:

    def __init__(self):
        pass

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

    def ResetIndexes():
        """
        -- ALTER SEQUENCE product_id_seq RESTART WITH 1453;
        -- setval('product_id_seq', 1453);
        -- SELECT SETVAL('project_id_seq', (SELECT MAX(id) + 1 FROM project));
        """
        pass


if __name__ == "__main__":
    x = BackupData()
    x.BuildJsonFiles()