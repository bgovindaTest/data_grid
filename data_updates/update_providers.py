"""
This data uses the text file created from running roster.sql. It process the data and looks for
new: [entity, department, specialty, cost_center, provider, appointment]. An excel file is generated
to add data directly to app through web interface. And two .psql files are created to deactivate providers
who have left an appointment.

insert into items_ver (item_id, name, item_group)
select item_id, name, item_group from items where item_id=2;

"""
from io import StringIO
from collections import OrderedDict
import pandas as pd

import psycopg2
import psycopg2.extras
import config
import pyodbc
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
            "Server=USXXX00345,67800;"
            "Database=DB02;"
            "UID=Alex;"
            "PWD=Alex123;")
cnxn = pyodbc.connect(cnxn_str)
cursor = cnxn.cursor()
cursor.execute("SELECT TOP(100) * FROM associates")
data = pd.read_sql("SELECT TOP(100) * FROM associates", cnxn)
new_providers = data[~ data['NPI'].isin(pe_npi)]
#NPI not in xyz


#Make sure EmployeeNumber and NPI are strings
#get actual id for appointment row?

class LoadRoster:

    def __init__(self):
        self.rx = None #rx is roster data frame
        self.output_df = {} #this object stores all the dataframes to be written to excel
        self.output_list = []

    def Load(self):
        pass


    def Run(self):
        self.Load()
        self.WriteExcelFile()
        self.CreateUpdateScripts()

    def RunPull(self, sql_query):
        """
        Takes query string and pulls data from database. Returns results as json array
        """
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql_query)
        rows = cur.fetchall()
        return rows

    def ReadSql(self, fpath):
        #Loads SQL strings
        f = open(fpath)
        sql_str = f.read()
        f.close()
        return sql_str

    def ValueStr(self, data_frame, set_list):
        tmp = []
        for index, row in data_frame.iterrows():
            val = self.BuildValueRow(row, set_list)
            tmp.append(val)
        vals = ',\n'.join(tmp)
        return vals

    def BuildValueRow(self,data_row, set_list):
        """
        data_row is an dictionary. set_list contains the keys that should be used
        to create each update row
        """
        tmp = []
        for key in set_list:
            value = data_row[key]
            set_str = "$${value}$$".format( value=value)
            tmp.append(set_str)

        return "( {values} ) ".format(values = ','.join(tmp) )

    def PE_TermedProviders(self, values):
        x = """
        BEGIN;
        UPDATE provider_effort.providers 
            SET end_date = t.end_date
        FROM 

        SELECT employee_number,  end_date
        FROM (
            VALUES
            {values}
        ) as t ( employee_number, end_date )
        WHERE providers.employee_number = t.employee_number 
            AND providers.end_date IS NULL
        COMMIT;
        """.format(values=values)
        return x

    def PE_NewProviders(self, values):
        x = """
        BEGIN;
        INSERT INTO provider_effort.providers (npi, employee_number, first_name, last_name, classification_id, start_date, end_date)

        select npi, employee_number, first_name, last_name, classificaiton_id, start_date, end_date
        FROM (
            VALUES
            {values}
        ) as t ( npi, employee_number, first_name, last_name, classificaiton_id, start_date, end_date )
        WHERE t.npi NOT IN (SELECT npi from provider_effort.providers) AND t.employee_number NOT IN (SELECT employee_number from provider_effort.providers)
        AND t.npi IS NOT NULL and t.employee_number IS NOT NULL
        
        ON CONFLICT DO NOTHING;
        COMMIT;
        """.format(values=values)
        return x


if __name__ == '__main__':
    x = LoadRoster()
    x.Run()