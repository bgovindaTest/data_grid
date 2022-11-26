"""
This data uses the text file created from running roster.sql. It process the data and looks for
new: [entity, department, specialty, cost_center, provider, appointment]. An excel file is generated
to add data directly to app through web interface. And two .psql files are created to deactivate providers
who have left an appointment.
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
        self.providerMap = None
        self.appointmentMap = None

    def Load(self):
        pass


    def Run(self):
        self.Load()


        self.WriteExcelFile()
        self.CreateUpdateScripts()


    def AssembleData(self, sheet_name, field_names, default_fields, alternative_sheet_name = ''):
        """


        """
        on = sheet_name
        x = self.rx[ self.rx[on] == 1]
        dx = self.AppendRows(x, field_names, default_fields )
        if alternative_sheet_name == '':
            self.output_df[on] = dx
            self.output_list.append(on)
        else:
            self.output_df[alternative_sheet_name] = dx
            self.output_list.append(alternative_sheet_name)



    def AppendRows(self, df, field_names, default_fields):
        #df is dataframe
        x = {}
        for fn in field_names:
            x[fn] = []

        for fn in default_fields.keys():
            x[fn] = []

        for index, row in df.iterrows():
            for fn in field_names:
                x[fn].append(row[fn])
            for key in default_fields:
                x[key].append(default_fields[key])
        field_names.extend(default_fields.keys())
        dfo = pd.DataFrame(x, columns = field_names )
        return dfo

    def WriteExcelFile(self):
        writer = pd.ExcelWriter(output_path, engine='xlsxwriter')
        for sheet_name in self.output_list:
            df = self.output_df[sheet_name]
            df.drop_duplicates(inplace=True)
            df.to_excel(writer, sheet_name=sheet_name, index=False )
        writer.save()


    #Create deactivation query scripts.
    def CreateInsertScripts(self):
        """
        creates the .psql files to run todo batch updates
        """
        self.PullPeDatabaseCreateMaps()
        appointmentsMap = self.appointmentMap
        providersMap = self.providerMap
        #providers
        #(self, table_name, id_key, id_map  ,data_rows, set_list, output_file_name)
        providerData = self.output_df['deactivated_provider']
        providerData['is_active'] = 'false'
        appointmentData = self.output_df['deactivated_appointment']
        appointmentData['is_active'] = 'false'
        self.UpdateTableById('providers', "NPI", providersMap ,providerData, ['is_active'], "./deactivated_providers.psql")
        #appointments
        self.UpdateTableById('appointments', "appointment_code", appointmentsMap  ,appointmentData, ['is_active'], "./deactivated_appointments.psql")

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

    def PullPeDatabaseCreateMaps(self):
        """
        Runs each query and creates a code to id map for further processing
        """
        sqlp = '../../sql_query/pe/'
        pm = self.providerMap
        ap = self.appointmentMap

        self.providerMap = self.RunPullAndCreateMap(  sqlp + 'providers.psql', 'npi','provider_id' )
        self.appointmentMap = self.RunPullAndCreateMap(  sqlp + 'appointments.psql', 'appointment_code','appointment_id' )

    def RunPullAndCreateMap(self, sql_file_path, key, value):
        """
        Pull data from database
        Creates key -> id map for every pulled table.
        """
        sql_str = self.ReadSql(sql_file_path)
        rows = self.RunPull(sql_str)
        return self.CreateMap(rows, key, value)

    def CreateMap(self, rows, key, value):
        """
        Creates key -> id map for every pulled table.
        """
        x = {}
        for row in rows:
            x[row[key]] = str(row[value])
        return x

    def UpdateTableById(self, table_name, id_key, id_map  ,data_rows, set_list, output_file_name):
        """
        table_name: name of the table to modify
        id_key: value of the key i.e. npi for providers and appointment_code for appointments
        id_map: providersMap or appointmentsMap. Used to get row_id from pro 
        data_rows: pandas data frame of data.
        set_list: array of names to include in update string
        output_file_name: path to sql output file.
        """
        sql_out = ["BEGIN;\n"]
        for index, data_row in data_rows.iterrows():
            try:
                set_str = self.BuildSetString(data_row, set_list)
                idx = id_map[ data_row[id_key] ]
                update_str = "UPDATE {table_name} SET {set_str} WHERE id = {id};\n".format(set_str= set_str, table_name=table_name, id=idx)
                sql_out.append(update_str)
            except:
                pass
        sql_out.append("COMMIT;")
        fout = open(output_file_name, "w")
        fout.write(''.join(sql_out))
        fout.close()

    def BuildSetString(self,data_row, set_list):
        """
        data_row is an dictionary. set_list contains the keys that should be used
        to create each update row
        """
        tmp = []
        for key in set_list:
            if key == 'id':
                continue
            value = data_row[key]
            set_str = "{key} = $${value}$$".format( key=key, value=value)
            tmp.append(set_str)
        return ', '.join(tmp)




if __name__ == '__main__':
    x = LoadRoster()
    x.Run()