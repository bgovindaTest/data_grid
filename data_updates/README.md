# directory contains scripts for updating providers, company, lob, department, specialty, cost_center

This package is used to sync data between the Provider Effort App and the EDW. Providers and Appointments are pulled from roster to determine whos active and deactive in the provider effort app. The one minus table is pulled from provider effort app and sql files are created to jam the data into the edw.

Steps on Monday:

1.) Run ./sql_query/edw/roster.sql. Put output file as output.txt in ./roster_edw/pe This pulls data from the edw roster.

2.) Run ./roster_edw/pe/LoadRosterQuery.py Excel and psql files are created from the output generated from step 1. put information in app Add data in excel first starting with first sheet and going to last. Then run psql files. 3.) Run ./roster_edw/edw/createOneMinusEDW.py This pulls data from provider effort app and creates .sql files for adding data back to the edw 4.) Run sql files ./roster_edw/edw/edw_out Runs sql files in numerical order to add data to edw.

For Updating lcgs: Run addLcgToApps. Will create a .psql file for appointments that have cpsc value defined and no lcg value. Will use cpsc_to_lcg to set the lcg value based on the cpsc value for the provider. This works because vizient has a function to predict cpsc based on provider billing. So should always have a cpsc value.

