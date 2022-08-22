/*
read js app files write as json files. These are the configuration files
for the UI.

*/

const providers = require('../mixins/TestGrids/providers.js')
const appointments = require('../mixins/TestGrids/appointments.js')
const appointment_effort  = require('../mixins/TestGrids/appointment_effort.js')
const user_app_perms      = require('../mixins/TestGrids/user_app_perms.js')
const user_org_permission = require('../mixins/TestGrids/user_specialty_perms.js')
const home_page           = require('../mixins/TestGrids/home_page.js')

const output_dir = './psql/app_configs'



// const myJSON = JSON.stringify(obj);

/*
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
*/