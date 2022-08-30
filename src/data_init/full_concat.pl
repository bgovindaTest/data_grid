#final string to create initialization file
#concats are created in order

$insert_path = '/home/bgovi/PsqlCred/output_data/sql/all_data.psql';
$roles_path = "./psql/create_roles.psql";
$index_reset_path = "/home/bgovi/PsqlCred/output_data/sql_admin/reset_index.psql";
$update_trigger   = "/home/bgovi/PsqlCred/output_data/sql_admin/updatedat_trigger.psql";
$app_user_trig    = "/home/bgovi/PsqlCred/output_data/sql_admin/appuser_trigger.psql";
$app_init        = '/home/bgovi/PsqlCred/output_data/app_init.psql';

# `cat  ./psql/psql_init.psql > ${app_init}`;

`(echo "DROP DATABASE IF EXISTS app;\nCREATE DATABASE app;\nBEGIN;\n"; cat  ./psql/psql_init.psql ${insert_path} ${roles_path} ${index_reset_path} ${update_trigger} ${app_user_trig} )> ${app_init}`;
`echo "\nCOMMIT;\n" >> ${app_init}`