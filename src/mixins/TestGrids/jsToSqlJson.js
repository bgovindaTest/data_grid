const home_page           = require('./app_configs/landing_page.js')
const providers           = require('./providers.js')
const appointments        = require('./appointments.js')
const appointment_effort  = require('./appointment_effort.js')
const user_app_perms      = require('./user_app_perms.js')
const user_org_permission = require('./user_specialty_perms.js')


//org
const company           = require('./app_configs/org/company.js')
const lob               = require('./app_configs/org/lob.js')
const department        = require('./app_configs/org/department.js')
const specialty         = require('./app_configs/org/specialty.js')
const cost_center       = require('./app_configs/org/cost_center.js')
const cost_center_time  = require('./app_configs/org/cost_center_time.js')
const fs = require('fs')

let apps = [
    //main
    {'id': '1', 'project_name': 'provider_effort', 'table_name': 'home_page',
        "page_config": JSON.stringify(home_page),  'is_public': 'true',  'description': "" },
    {'id': '2', 'project_name': 'provider_effort', 'table_name': 'providers', 
        "page_config":JSON.stringify(providers),    'is_public': 'false', 'description': "" },
    {'id': '3', 'project_name': 'provider_effort', 'table_name': 'appointments', 
        "page_config":JSON.stringify(appointments), 'is_public': 'false', 'description': "" },
    {'id': '4', 'project_name': 'provider_effort', 'table_name': 'appointment_effort',
        "page_config":JSON.stringify(appointment_effort), 'is_public': 'false', 'description': "" },
    //org heirarchy
    {'id': '5',  'project_name': 'provider_effort', 'table_name': 'company',
        "page_config":JSON.stringify(company), 'is_public': 'false', 'description': "" },
    {'id': '6',  'project_name': 'provider_effort', 'table_name': 'lob',
        "page_config":JSON.stringify(lob), 'is_public': 'false', 'description': "" },
    {'id': '7',  'project_name': 'provider_effort', 'table_name': 'department',
        "page_config":JSON.stringify(department), 'is_public': 'false', 'description': "" },
    {'id': '8',  'project_name': 'provider_effort', 'table_name': 'specialty',
        "page_config":JSON.stringify(specialty), 'is_public': 'false', 'description': "" },
    {'id': '9',  'project_name': 'provider_effort', 'table_name': 'cost_center',
        "page_config":JSON.stringify(cost_center), 'is_public': 'false', 'description': "" },
    {'id': '10', 'project_name': 'provider_effort', 'table_name': 'cost_center_time',
        "page_config":JSON.stringify(cost_center_time), 'is_public': 'false', 'description': "" },
    //perms
    {'id': '11', 'project_name': 'provider_effort', 'table_name': 'user_app_perms',
        "page_config":JSON.stringify(user_app_perms), 'is_public': 'false', 'description': "" },
    {'id': '12', 'project_name': 'provider_effort', 'table_name': 'user_org_permsission',
        "page_config":JSON.stringify(user_org_permission), 'is_public': 'false', 'description': "" },
]

let insertStr = "INSERT INTO app_admin.apps (id,project_name, table_name, description, page_config, is_test, is_public) VALUES\n"
let values = []

for (x of apps) {
    console.log(x.id)
    let tmpStr = `( '${x.id}', '${x.project_name}', '${x.table_name}', '${x.description}', $$${x.page_config}$$, 'false', '${x.is_public}'  )`
    values.push(tmpStr)
}
let out_path = '/home/bgovi/PsqlCred/output_data/sql_admin/apps.psql'


let out_str = insertStr + values.join(',\n') + ';'
console.log(out_str)