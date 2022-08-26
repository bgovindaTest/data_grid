let rx = '/home/bgovi/Workspace/MultiGrid/data_grid/src/mixins/TestGrids'

const home_page           = require(rx+'/app_configs/landing_page.js')
const providers           = require(rx+'/providers.js')
const appointments        = require(rx+'/appointments.js')
const appointment_effort  = require(rx+'/appointment_effort.js')
const user_app_perms      = require(rx+'/user_app_perms.js')
const user_org_permission = require(rx+'/user_specialty_perms.js')


//org
const company           = require(rx+'/app_configs/org/company.js')
const lob               = require(rx+'/app_configs/org/lob.js')
const department        = require(rx+'/app_configs/org/department.js')
const specialty         = require(rx+'/app_configs/org/specialty.js')
const cost_center       = require(rx+'/app_configs/org/cost_center.js')
const cost_center_time  = require(rx+'/app_configs/org/cost_center_time.js')
const fs = require('fs')

let apps = [
    //main myapps
    {'id': '1', 'project_name': 'provider_effort', 'table_name': 'home_page',
        "page_config": JSON.stringify(home_page),  'is_public': 'true',  'description': "Urls to other tables you have permisisons for",
        'permissions': ['app_admin.home_page_rv.read_only']
    },
    {'id': '2', 'project_name': 'provider_effort', 'table_name': 'providers', 
        "page_config":JSON.stringify(providers),    'is_public': 'false', 'description': "List of all providers name, npi.",
        'permissions': ["provider_effort.providers.modify",  "provider_effort.providers_rv.read_only",
            "provider_effort.lcg_lv.read_only", "provider_effort.cpsc_lv.read_only", "provider_effort.classifications.read_only"
        ]
    },
    {'id': '3', 'project_name': 'provider_effort', 'table_name': 'appointments', 
        "page_config":JSON.stringify(appointments), 'is_public': 'false', 'description': "providers attached to cost centers",
        'permissions': [ "provider_effort.appointments_uv.modify", "provider_effort.appointments_rv.read_only",
            "provider_effort.lcg_lv.read_only", "provider_effort.cpsc_lv.read_only",
            "provider_effort.cost_centers_byuser_lv.read_only", "provider_effort.providers_lv.read_only",
        ]
    },
    {'id': '4', 'project_name': 'provider_effort', 'table_name': 'appointment_effort',
        "page_config":JSON.stringify(appointment_effort), 'is_public': 'false', 'description': "effort of providers at cost center level",
        'permissions': [
            "provider_effort.appointments_byuser_lv.read_only", "provider_effort.appointment_effort_byuser_uv.modify",
            "provider_effort.appointment_effort_byuser_rv.read_only"
        ]
    },
    //org heirarchy
    {'id': '5',  'project_name': 'provider_effort', 'table_name': 'company',
        "page_config":JSON.stringify(company), 'is_public': 'false', 'description': "company information and links",
        "permissions": ["provider_effort.company_rv.read_only","provider_effort.company.modify" ]
    },
    {'id': '6',  'project_name': 'provider_effort', 'table_name': 'lob',
        "page_config":JSON.stringify(lob), 'is_public': 'false', 'description': "lob information and links",
        "permissions": ["provider_effort.line_of_business_rv.read_only","provider_effort.line_of_business.modify",
            "provider_effort.company_lv.read_only" ]
    },
    {'id': '7',  'project_name': 'provider_effort', 'table_name': 'department',
        "page_config":JSON.stringify(department), 'is_public': 'false', 'description': "department information and links",
        "permissions": ["provider_effort.department_rv.read_only","provider_effort.department.modify",
            "provider_effort.line_of_business_lv.read_only" ]
    },
    {'id': '8',  'project_name': 'provider_effort', 'table_name': 'specialty',
        "page_config":JSON.stringify(specialty), 'is_public': 'false', 'description': "specialty information and links",
        "permissions": ["provider_effort.specialty_rv.read_only","provider_effort.specialty.modify",
            "provider_effort.department_lv.read_only" ]
    },
    {'id': '9',  'project_name': 'provider_effort', 'table_name': 'cost_center',
        "page_config":JSON.stringify(cost_center), 'is_public': 'false', 'description': "cost_center information and links",
        "permissions": ["provider_effort.cost_center_rv.read_only","provider_effort.cost_center.modify",
            "provider_effort.specialty_lv.read_only" ]
    },
    {'id': '10', 'project_name': 'provider_effort', 'table_name': 'cost_center_time',
        "page_config":JSON.stringify(cost_center_time), 'is_public': 'false', 'description': "default full time effort values at cost centers",
        "permissions": ["provider_effort.cost_center_time_rv.read_only","provider_effort.cost_center_time.modify" ]
    },
    //perms
    {'id': '11', 'project_name': 'provider_effort', 'table_name': 'user_app_perms',
        "page_config":JSON.stringify(user_app_perms), 'is_public': 'false', 'description': "users permissions for table access",
        "permissions": ['app_admin.app_permission_rv.read_only', 'app_admin.app_permissions.modify', 'app_admin.users_lv.read_only']
    },
    {'id': '12', 'project_name': 'provider_effort', 'table_name': 'user_org_permsission',
        "page_config":JSON.stringify(user_org_permission), 'is_public': 'false', 'description': "user responsibilites based on company/lob/dept/specialty/cost_center",
        "permissions": ['app_admin.user_org_permission_rv.read_only', 'app_admin.user_org_permission.modify', 'app_admin.users_lv.read_only',
            "provider_effort.cost_center_lv"]
    },
]

/*
Add app configurations and descriptions
*/
let insertStr = "INSERT INTO app_admin.apps (id,project_name, table_name, description, page_config, is_test, is_public) VALUES\n"
let values = []

for (x of apps) {


    console.log(x.id)
    let tmpStr = `( '${x.id}', '${x.project_name}', '${x.table_name}', '${x.description}', $$${x.page_config}$$, 'false', '${x.is_public}'  )`
    values.push(tmpStr)
}
let out_path = '/home/bgovi/PsqlCred/output_data/sql_admin/apps.psql'
let out_str = insertStr + values.join(',\n') + ';'
fs.writeFileSync(out_path, out_str);

/*registered_tables*/
let registeredTablesStr = `
INSERT INTO app_admin.registered_tables (permission_name, schema_name, table_name,
    allow_select,allow_exists, allow_insert, allow_update, allow_delete, allow_save)


    select schemaname|| '.'|| viewname || ".read_only" as permission_name, schemaname, viewname as tablename, true as allow_select, true as allow_exists,
        false as allow_insert, false as allow_update , false as allow_delete, false as allow_save
    from pg_catalog.pg_views
    where schemaname IN ('provider_effort', 'app_admin')
    UNION ALL
    select schemaname|| '.'|| tablename || ".read_only" as permission_name, schemaname, viewname as tablename, true as allow_select, true as allow_exists,
        false as allow_insert, false as allow_update , false as allow_delete, false as allow_save
    from pg_catalog.pg_tables
    where schemaname IN ('provider_effort', 'app_admin')

    UNION ALL
    select schemaname|| '.'|| tablename || ".modify" as permission_name, schemaname, tablename, true as allow_select, true as allow_exists,
        true as allow_insert, true as allow_update , true as allow_delete, true as allow_save
    from ( VALUES ( 'provider_effort','appointment_effort_byuser_uv'), ('provider_effort' , 'appointments_byuser_uv' ) ) as x (schemaname, tablename)
    
    UNION ALL
    select schemaname|| '.'|| tablename || ".modify" as permission_name, schemaname, viewname as tablename, true as allow_select, true as allow_exists,
        true as allow_insert, true as allow_update , true as allow_delete, true as allow_save
    from pg_catalog.pg_tables
    where schemaname IN ('provider_effort', 'app_admin');
`
out_path = '/home/bgovi/PsqlCred/output_data/sql_admin/registered_tables.psql'
fs.writeFileSync(out_path, registeredTablesStr);

/*
app and user permissions
*/


strsx = []

for (x of apps) {
    let app_id = x.id
    let perms = x.permissions
    let pa  = []
    perms.forEach(perm => pa.push(`'${perm}'`))
    let permissions = pa.join(',')
    let tmpStr = `
    INSERT INTO app_admin.app_permissions (app_id , registered_table_id)
    SELECT id as registered_table_id
    FROM app_admin.registered_tables 
    CROSS JOIN (SELECT ${app_id} as app_id) x
    WHERE permission_name IN (${permissions});
    `
    strsx.push(tmpStr)
}
out_path = '/home/bgovi/PsqlCred/output_data/sql_admin/apps.psql'

strsx.push(
`
INSERT INTO app_admin.user_app_permissions(user_id, app_id, is_read_only)
SELECT user_id, 2, false FROM app_admin.users
UNION
SELECT user_id, 3, false FROM app_admin.users;
`
)

out_str = strsx.join('\n')
fs.writeFileSync(out_path, out_str);