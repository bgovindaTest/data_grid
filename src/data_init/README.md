# Initializes database for app must be in same directory as script
1.) perl data_init/psql/app_views/concat_sql.pl
2.) perl data_init/psql/concat_sql.pl
3.) perl data_init/full_concat.pl
4.) psql -f PsqlCred/data_init.psql


-- https://stackoverflow.com/questions/12815496/export-specific-rows-from-a-postgresql-table-as-insert-sql-script

1.) Pull Data from server
2.) create_functions
3.) create_tables
4.) insert_data
5.) create_roles
6.) add_configurations i.e. timezone
7.) add triggers



## data_init structure
1.) schema_init.psql drop creates schemas required for intiailization
2.) create_functions required functions needed before creating table due to default values
3.) create_tables.psql contains commands to create all tables for pe and admin.
    3a.) pe_data_remap, admin_data_remap has queries to populate the table from old system.
    create_init_files.py creates the sql files to populate the system
4.) create_app_config.js converts json files to configuration files.
5.) index_trigger_init.py creates .sql file to reset indexes and add triggers
6.) drop/create_roles. create roles for psql generates .sql files
7.) registred tables and app permissions.
8.) run_init_files.py. Runs .sql files in correct order going from steps 1-6.

