/*
List of termed providers
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

SELECT EmployeeNumber as employee_number, CONVERT(VARCHAR, EndDate, 23) as end_date
FROM roster as rx
WHERE EndDate >= DATEADD(MONTH, -1, CURRENT_TIMESTAMP)
AND '9999-12-31' <> CONVERT(VARCHAR, EndDate, 23)
;