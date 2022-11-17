/*
This query pulls data from roster and compares it to data stored in [Reporting_IUHP].[ProviderEffortOneMinus]

Its used to look for new providers, appointments, company, lob, department, specialty and cost center. 

The query adds boolean columns to know the state of providers and appointments i.e. if they are new or deactivated from
a cost center or the iuh system.

provider is a doctor at iu health
appointment is a provider at a company and cost center

need is active statement for appointment and provider lines 32-33 wont work yet.
*/
WITH roster as (
    SELECT -- TOP 10 
    Classification, EmployeeNumber, BeginDate,
    EndDate, MaxFte, LastName, FirstName,  EmpStatusCD, NPI

    FROM (
            SELECT Org_Level9_ProviderClassificationName as Classification, Rost_EmployeeNBR as EmployeeNumber,  
            LAST_NAME as LastName, FIRST_NAME as FirstName, EmpStatusCD,NPI,
            MIN( Rost_EffectiveBeginDate ) as BeginDate, MAX( Rost_EffectiveEndDate ) as EndDate, 
            MAX( Rost_FteCorrected ) as MaxFte

            FROM [Reporting_IUHP].[OracleERP_Roster_v0]
            WHERE  NPI != 'NULL'
            GROUP BY Org_Level9_ProviderClassificationName, Rost_EmployeeNBR, LAST_NAME, FIRST_NAME,
                EmpStatusCD , NPI
            HAVING MAX( Rost_FteCorrected ) > 0.01
    ) as r
)

SELECT Classification, EmployeeNumber, BeginDate,
    EndDate, MaxFte,  LastName, FirstName,  EmpStatusCD, NPI
FROM roster as rx
--where start_date >= ''