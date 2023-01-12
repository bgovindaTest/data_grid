/*
List of new providers in roster.
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

--need to verify data is verified data type
SELECT * FROM (
SELECT 
    CASE 
        WHEN LOWER(Classification) = 'physician' THEN '1'
        ELSE '2' END as classification_id,
    EmployeeNumber as employee_number, 
    CONVERT(VARCHAR, BeginDate, 23) as start_date, 
    --CONVERT(VARCHAR, EndDate, 23) as end_date,
    NULL as end_date,
    LastName as last_name, FirstName as first_name, NPI as npi
FROM roster as rx
WHERE BeginDate >= DATEADD(MONTH, -3, CURRENT_TIMESTAMP)
) x
;