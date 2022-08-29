"""
This file creates a backup of all tables in postgres provider effort database.
Exports them as json and csv (or some other delimiter)
"""
import json
import psycopg2
import psycopg2.extras
import sys
sys.path.append('/home/bgovi/PsqlCred/')
import psql_cred
import index_admin_init
import os

output_connect_string = psql_cred.output_connect_string
output_path = '/home/bgovi/PsqlCred/output_data'
conn = psycopg2.connect(output_connect_string)

sql_inserts = output_path +'/sql/'
sql_admin   = output_path +'/sql_admin/'
general     = '/home/bgovi/Workspace/MultiGrid/data_grid/src/data_init/psql/'

class PEINIT:

    def __init__(self):
        self.provider_effort_tables = index_admin_init.provider_effort_tables
        self.admin_tables           = index_admin_init.admin_tables

    def Run(self):
        """
            Order of script calls matters:
            drop/create schema
            create functions
            create admin tables
            create provider_effort tables
            insert data
            reset indexes
            add triggers
            create_views
            create policies
            create roles
            insert config files (for deployment component)
        """
        self.RunSqlFile(general+'schema_init.psql')
        self.RunSqlFile(general+'create_functions.psql')
        self.RunSqlFile(general+'create_tables.psql')
        admin_list    = self.admin_tables
        self.InsertData(sql_inserts, admin_list )
        provider_list = self.provider_effort_tables
        self.InsertData(sql_inserts, provider_list )

    def RunSqlFile(self, file_name, is_commit = False):
        print(file_name)
        sql_str = self.ReadSqlFile(file_name)
        self.RunQuery(sql_str, is_commit)

    def InsertData(self, base_path, table_list):
        for tx in table_list:
            fx = base_path+tx+'.psql'
            if not os.path.exists(fx):
                print('Skipping', fx)
                continue
            self.RunSqlFile(base_path+tx+'.psql', True)

        #run sepearte queries
    def RunQuery(self, sql_query, is_commit):
        cur = conn.cursor() #(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql_query)
        if is_commit:
            conn.commit()


    def ReadSqlFile(self, file_path):
        f = open(file_path)
        sql_str = f.read()
        f.close()
        return sql_str


# company
# line_of_business
# department
# specialty
# time_units
# cost_center
# company_cost_center
# classifications
# cpsc
# lcg
# cpsc_lcg_map
# providers
# appointments
# appointment_effort
# oracle_effort
# user_org_permission
# full_org




if __name__ == "__main__":
    x = PEINIT()
    x.Run()