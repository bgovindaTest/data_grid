"""
Initializes admin tables and index reset. Creates .sql files
for reseting indexes and adding triggers.
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

apps = []


class IX:
    def __init__(self):
        self.provider_effort_tables = provider_effort_tables
        self.admin_tables = admin_tables
        self.table_perms_map = {}
        self.app_perms = {}

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

    def AppUserTrigger(self):
        """
            Resets serial indexes to max_id
        """
        mkdir(sql_out)
        fname = sql_out+'appuser_trigger.psql'
        fout = open(fname, 'w')
        tempStr = """
            CREATE TRIGGER set_app_userid
            BEFORE UPDATE OR INSERT ON {table_name}
            FOR EACH ROW
            EXECUTE PROCEDURE trigger_last_modified_by_userid();\n
        """


        for tx in self.provider_effort_tables:
            x = tempStr.format(table_name = tx)
            fout.write(x)
        for tx in self.admin_tables:
            x = tempStr.format(table_name = tx)
            fout.write(x)
        fout.close()

    def UpdatedAtTrigger(self):
        """
            Resets serial indexes to max_id
        """
        mkdir(sql_out)
        fname = sql_out+'updatedat_trigger.psql'
        fout = open(fname, 'w')
        tempStr = """
            CREATE TRIGGER updated_at_timestamp
            BEFORE UPDATE ON {table_name}
            FOR EACH ROW
            EXECUTE PROCEDURE trigger_updated_at();\n
        """


        for tx in self.provider_effort_tables:
            x = tempStr.format(table_name = tx)
            fout.write(x)
        for tx in self.admin_tables:
            x = tempStr.format(table_name = tx)
            fout.write(x)
        fout.close()

    def RegisteredTableViewInsert(self):
        mkdir(sql_out)
        fname = sql_out+'registered_tables_insert.psql'
        fout = open(fname, 'w')
        insertStr = """
            INSERT INTO app_admin.registered_tables (id, description, schema_name, table_name, allow_select, allow_insert, allow_update, allow_delete) VALUES\n
        """
        tmpStr = """
            ({id}, {description}, {schema_name}, {table_name}, true, true, true, true )
        """

        tmpStrR = """
            ({id}, {description}, {schema_name}, {table_name}, true, false, false, false )
        """

        vals = []
        i = 1
        for tx in self.provider_effort_tables:
            self.table_perms_map[tx] = i
            schema_name, table_name = tx.split('.')
            x = tempStr.format(table_name = table_name, schema_name = schema_name, id = i, description = tx)
            i+=1
            vals.push(x)
        for tx in self.admin_tables:
            self.table_perms_map[tx] = i
            schema_name, table_name = tx.split('.')
            x = tempStr.format(table_name = table_name, schema_name = schema_name, id = i, description = tx)
            i+=1
            vals.push(x)
        #add views
        viewsx = [
# provider_effort.company_rv
# provider_effort.line_of_business_rv
# provider_effort.department_rv
# provider_effort.specialty_rv 
# provider_effort.cost_center_rv 
# provider_effort.cost_center_time_rv
# provider_effort.providers_rv
# provider_effort.appointments_rv
        ]

# provider_effort.appointment_effort_byuser_rv
# provider_effort.appointment_effort_byuser_uv
# provider_effort.appointments_byuser_rv
# provider_effort.appointments_byuser_uv



        fout.write(insertStr)
        fout.write(',\n'.join(vals))
        fout.write(';')
        fout.close()


provider_effort.appointment_effort_current_rv

# 1. const providers = require('../mixins/TestGrids/providers.js')
# 2. const appointments = require('../mixins/TestGrids/appointments.js')
# 3. const appointment_effort  = require('../mixins/TestGrids/appointment_effort.js')
# 4. const user_app_perms      = require('../mixins/TestGrids/user_app_perms.js')
# 5. const user_org_permission = require('../mixins/TestGrids/user_specialty_perms.js')
# 6. const home_page           = require('../mixins/TestGrids/home_page.js')



"""
CREATE TABLE app_admin.apps(
    id bigserial PRIMARY KEY,
    project_name text NOT NULL,
    table_name   text NOT NULL,
    description  text,
    page_config  json,
    is_public    boolean default false NOT NULL, --anyone that can login has access
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_modified_userid   bigint  DEFAULT app_userid(),

    UNIQUE(project_name, table_name)
);


CREATE TABLE app_admin.app_permissions (
    id bigserial PRIMARY KEY,
    app_id bigint REFERENCES app_admin.apps (id) NOT NULL,
    registered_table_id bigint REFERENCES app_admin.registered_tables (id) NOT NULL,
    is_test boolean default true, 
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_modified_userid   bigint  DEFAULT app_userid(),

    UNIQUE(app_id, registered_table_id)
);
"""



if __name__ == "__main__":
    x = IX()
    x.ResetIndex()
    x.AppUserTrigger()
    x.UpdatedAtTrigger()
    x.RegisteredTableViewInsert()


