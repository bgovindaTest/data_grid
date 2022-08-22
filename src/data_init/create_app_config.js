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