let test_grid = {
"grids": [
    {
        "navHeaderParams": {
            "links": [{'name':'providers', 'url': '/providers'}]
        },
        "columnDefs": [
            {"field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
            'isRequired': true, "isLookup": true, "width": 120, "defaultSort": "desc",
                'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                    {'is_active': 'true', 'id': 'true'} 
                    ,{'is_active': 'false', 'id': 'false'}
                
                    ]}
            },
            {"field": "last_name", "valueGetter": "lookup(appointment_id,  'last_name')",  "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
            {"field": "first_name","valueGetter":"lookup(appointment_id,   'first_name')", "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
            {"field": "appointment_id", "headerName": "EmployeeNumCompanyCostCenter", "editable": true, "showSort": true, 
            "showFilter": true, "isRequired": true, "cloneOnCopy": true,
            "cellEditor": 'autoCompleteEditor', "width": 300, 
                "cellEditorParams": {
                    "api_route": "data/provider_effort/appointments_rv",
                    "columnDefs": [
                        {"field":'id'}, {"field":'last_name'}, {"field": 'first_name'},{"field": 'org_name'},
                        {"field": 'org_code'}, {"field": 'employee_number'},{"field": 'npi'},{"field": 'appointment_code'}
                    ],
                    "displayKey": "appointment_code"
                }
            },
            {"field": "effective_date", "headerName": "EffectiveDate", "cellEditor": 'dateTimeEditor',
                "dataType": "date", "editable": true, "showSort": true, "showFilter": true, "defaultSort": "desc"},
            {"field": "cfte",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['cfte'], "validator":"1 >= ifnull(cfte,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "veterans_affairs",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['veterans_affairs'],
                "validator":"1 >= ifnull(veterans_affairs,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},
    
            {"field": "contract",   "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['contract'] ,
                "validator":"1 >= ifnull(contract,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "academic",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['academic'] ,
                "validator":"1 >= ifnull(academic,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "administration",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['administration'],
                "validator":"1 >= ifnull(administration,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "full_effort",   "valueGetter": "ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administration,0) " ,
                "validator": "1>= ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administration,0)  >=0"},

            {"field": "cfte_full_time" , "cloneOnCopy": true, "editable":true,
                "validator": "ifnull(cfte_full_time,0)  >=0"},
            {"field": "time_unit_name", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },

            {"field": "cfte_time",   "valueGetter": "ifnull(cfte_full_time,40.0) * ( ifnull(cfte,0) )"},
            {"field": "company_name", "valueGetter":"lookup(appointment_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "company_code", "valueGetter":"lookup(appointment_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "lob_name", "valueGetter":"lookup(appointment_id,   'lob_name')", "editable": false, "showSort": true, "showFilter": true},                
            {"field": "lob_code", "valueGetter":"lookup(appointment_id,   'lob_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "department_name", "valueGetter":"lookup(appointment_id,    'department_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "department_code", "valueGetter":"lookup(appointment_id,    'department_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "specialty_name", "valueGetter":"lookup(appointment_id,     'specialty_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "specialty_code", "valueGetter":"lookup(appointment_id,     'specialty_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "cost_center_name", "valueGetter":"lookup(appointment_id,   'cost_center_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "cost_center_code", "valueGetter":"lookup(appointment_id,   'cost_center_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "npi", "valueGetter":"lookup(appointment_id,   'npi')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "employee_number", "valueGetter":"lookup(appointment_id,   'employee_number')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
            {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true }
        ],
        "routeParams": {
            "default_route":   "data/provider_effort/appointment_effort", //,
            'select': {'route':"data/provider_effort/appointment_effort_rv/select"}
        }
    }
]}

module.exports = test_grid