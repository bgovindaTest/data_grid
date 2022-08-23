const providers = require('./providers.js')
const appointments = require('./appointments.js')
const appointment_effort  = require('./appointment_effort.js')
const user_app_perms      = require('./user_app_perms.js')
const user_org_permission = require('./user_specialty_perms.js')
const home_page           = require('./app_configs/landing_page.js')

//org
const company           = require('./app_configs/org/company.js')
const lob               = require('./app_configs/org/lob.js')
const department        = require('./app_configs/org/department.js')
const specialty         = require('./app_configs/org/specialty.js')
const cost_center       = require('./app_configs/org/cost_center.js')
const cost_center_time  = require('./app_configs/org/cost_center_time.js')

module.exports = cost_center_time // specialty // company