"""
This data uses the text file created from running roster.sql. It process the data and looks for
new: [entity, department, specialty, cost_center, provider, appointment]. An excel file is generated
to add data directly to app through web interface. And two .psql files are created to deactivate providers
who have left an appointment.

insert into items_ver (item_id, name, item_group)
select item_id, name, item_group from items where item_id=2;

"""
import psycopg2
import psycopg2.extras
import config
import pyodbc
import os
pe  = config.pe
edw = config.edw

# psql_conn = "dbname={dbname} user={user} host='{server}' password='{password}'".format(
#     dbname=pe['database'], user=pe['user'], server=pe['server'], password=pe['password']
# )

# conn = psycopg2.connect()

cnxn_str = ("Driver=ODBC Driver 13 for SQL Server;"
            "Server={server};"
            "Database={database};"
            "UID={user};"
            "PWD={password};"
            "Authentication=ActiveDirectoryPassword;"
            ).format(server=edw['server'], user=edw['user'], password=edw['password'], database=edw['database'])

cnxn = pyodbc.connect(cnxn_str)


dir_path = os.path.dirname(os.path.realpath(__file__))
outputDir = os.path.join(dir_path, 'psql_files')
new_provider_file    = os.path.join(outputDir, 'new_providers.psql')
termed_provider_file = os.path.join(outputDir, 'termed_providers.psql')

os.makedirs(outputDir, exist_ok=True)

class LoadRoster:

    def __init__(self):
        pass

    def Run(self):
        self.NewProviders()
        self.TermedProviders()
        # self.RunPsql()

    def RunPsql(self):
        cursor = conn.cursor()
        newStr = self.ReadSql(outputDir+'/new_providers.psql')
        cursor.execute(newStr)
        conn.commit()

        termStr = self.ReadSql(outputDir+'/termed_providers.psql')
        cursor.execute(termStr)
        conn.commit()


    def NewProviders(self):
        columns = ['npi', 'employee_number', 'first_name', 'last_name', 'classification_id', 'start_date', 'end_date']
        rows = self.RunEdwPull('./edw_queries/tsql_new_providers.sql')
        typeDict = {'classification_id': 'bigint', 'start_date': 'date', 'end_date': 'date'}
        vals = self.ValueStr(rows, columns, typeDict)
        newProvidersStr = self.PE_NewProviders(vals)
        fpath = outputDir+'/new_providers.psql'
        f = open(fpath, 'w')
        f.write(newProvidersStr)
        f.close()

    def AppendTypes(self, typeDict,key, value):
        if key in typeDict:
            return value+'::'+typeDict[key]
        else:
            return value

    def TermedProviders(self):
        rows = self.RunEdwPull('./edw_queries/tsql_termed_providers.sql')
        typeDict = {'end_date': 'date'}
        vals = self.ValueStr(rows, [ 'employee_number', 'end_date' ], typeDict)
        newProvidersStr = self.PE_TermedProviders(vals)
        fpath = outputDir+'/termed_providers.psql'
        f = open(fpath, 'w')
        f.write(newProvidersStr)
        f.close()

    def RunEdwPull(self, sql_file):
        """
        Takes query string and pulls data from database. Returns results as json array
        """
        sqlString = self.ReadSql(sql_file)
        cursor = cnxn.cursor()
        rows = cursor.execute(sqlString).fetchall()
        columns = [column[0] for column in cursor.description]
        # print(columns)
        results = []
        for row in rows:
            results.append(dict(zip(columns, row)))
        return results

    def ReadSql(self, fpath):
        #Loads SQL strings
        f = open(fpath)
        sql_str = f.read()
        f.close()
        return sql_str

    def ValueStr(self, rows, set_list, typeDict):
        tmp = []
        for row in rows:
            val = self.BuildValueRow(row, set_list, typeDict)
            tmp.append(val)
        vals = ',\n'.join(tmp)
        return vals

    def BuildValueRow(self,data_row, set_list, typeDict):
        """
        data_row is an dictionary. set_list contains the keys that should be used
        to create each update row
        """
        tmp = []
        for key in set_list:
            value = data_row[key]
            if value is None:
                set_str = "null"
            else:
                set_str = "$${value}$$".format( value=value)
                set_str = self.AppendTypes(typeDict, key, set_str)
            tmp.append(set_str)

        return "( {values} ) ".format(values = ','.join(tmp) )

    def PE_TermedProviders(self, values):
        x = """
        UPDATE provider_effort.providers 
            SET end_date  = t.end_date, is_active = false
        FROM 
        (
            SELECT employee_number,  end_date
            FROM (
                VALUES
                {values}
            ) as x ( employee_number, end_date )
        ) as t
        WHERE providers.employee_number = t.employee_number 
            AND providers.end_date IS NULL;
        """.format(values=values)
        return x

    def PE_NewProviders(self, values):
        x = """
        INSERT INTO provider_effort.providers (npi, employee_number, first_name, last_name, classification_id, start_date, end_date)

        select npi, employee_number, first_name, last_name, classificaiton_id, start_date, end_date
        FROM (
            VALUES
            {values}
        ) as t ( npi, employee_number, first_name, last_name, classificaiton_id, start_date, end_date )
        WHERE t.npi NOT IN (SELECT npi from provider_effort.providers) AND t.employee_number NOT IN (SELECT employee_number from provider_effort.providers)
        AND t.npi IS NOT NULL and t.employee_number IS NOT NULL
        
        ON CONFLICT DO NOTHING;
        """.format(values=values)
        return x

if __name__ == '__main__':
    x = LoadRoster()
    x.Run()