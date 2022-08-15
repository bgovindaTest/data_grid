"""
Initializes admin tables and index reset. Aseembles init.psql file for
create everything

"""
import os
output_path = '/home/bgovi/PsqlCred/output_data'
sql_out = output_path +'/sql_admin/'
#file_order

def mkdir(path):
    try:
        os.mkdir(path)
    except:
        pass

provider_effort_tables = [  'provider_effort.company', 'provider_effort.line_of_business',
            'provider_effort.department', 'provider_effort.specialty', 'provider_effort.time_unit',
            'provider_effort.cost_center', 'provider_effort.cost_center_time', 'provider_effort.classifications',
            'provider_effort.lcg', 'provider_effort.cpsc', 'provider_effort.cpsc_lcg_map',
            'provider_effort.providers', 'provider_effort.appointments', 'provider_effort.appointment_effort',
            'provider_effort.oracle_effort', 'provider_effort.user_org_permission', 'provider_effort.refreshed_dates'
]

admin_tables = [ 'app_admin.users', 'app_admin.registered_tables', 'app_admin.apps',
            'app_admin.app_permissions', 'app_admin.user_app_permission'
]


class IX:
    def __init__(self):
        self.provider_effort_tables = provider_effort_tables
        self.admin_tables = admin_tables

    def ResetIndex(self):
        """
            Resets serial indexes to max_id
        """
        mkdir(sql_out)
        fname = sql_out+'reset_index.psql'
        fout = open(fname, 'w')
        for tx in self.provider_effort_tables:
            x = "SELECT SETVAL('{table_name}_id_seq', (SELECT MAX(id) + 1 FROM {table_name}));\n".format(table_name = tx)
            fout.write(x)
        for tx in self.admin_tables:
            x = "SELECT SETVAL('{table_name}_id_seq', (SELECT MAX(id) + 1 FROM {table_name}));\n".format(table_name = tx)
            fout.write(x)
        fout.close()

if __name__ == "__main__":
    x = IX()
    x.ResetIndex()

