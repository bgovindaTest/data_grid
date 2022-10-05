let appointment_effort_dateset = {
"comments": "Used to update cfte based on greatest reset date.",
"grids": [
    {
        "navHeaderParams": {
            "links": [
                {'name':'providers_cc', 'url': '/provider_effort/appointments'},
                {'name':'provider_cfte', 'url': '/provider_effort/appointment_effort'}
            ],
            'add_row': false
        },
        //table
        "columnDefs": [
            {"field": "last_name",  "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
            {"field": "first_name", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},

            {"field": "appointment_code", "headerName": "EmployeeNumCompanyCostCenter", "editable": false, "showSort": true, 
                "showFilter": true, "chmodParams": 'r'},


            {"field": "effective_date", "headerName": "EffectiveDate", "cellEditor": 'dateTimeEditor',
                "dataType": "date", "editable": true, "isRequired": true,
                "cellEditor": 'autoCompleteEditor', "width": 200, 
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/max_refreshed_date",
                        "columnDefs": [ {"field":'effective_date'} , {"field":"id", "hide": true}],
                        "pushKey": "effective_date",
                        "pullKey": "effective_date",
                    }
            },
            {"field": "cfte",  "dataType": "numeric","requiredFields": ['cfte'], "validator":"1 >= ifnull(cfte,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "veterans_affairs", "dataType": "numeric","requiredFields": ['veterans_affairs'],
                "validator":"1 >= ifnull(veterans_affairs,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},
    
            {"field": "contract", "dataType": "numeric","requiredFields": ['contract'] ,
                "validator":"1 >= ifnull(contract,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "academic", "dataType": "numeric","requiredFields": ['academic'] ,
                "validator":"1 >= ifnull(academic,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "administration", "dataType": "numeric","requiredFields": ['administration'],
                "validator":"1 >= ifnull(administration,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "full_effort", "showFilter": true, "showSort": true,  "valueGetter": "ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administration,0) " ,
                "validator": "1>= ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administration,0)  >=0"},

            {"field": "cfte_full_time" , "chmodParams": 'r',  "editable":true,
                "validator": "ifnull(cfte_full_time,0)  >=0"},
            {"field": "time_unit_name", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, },

            {"field": "cfte_time", "chmodParams": 'r',  "valueGetter": "ifnull(cfte_full_time,40.0) * ( ifnull(cfte,0) )"},
            {"field": "company_name","chmodParams": 'r',     "editable": false, "showSort": true, "showFilter": true},
            {"field": "company_code","chmodParams": 'r',     "editable": false, "showSort": true, "showFilter": true},
            {"field": "lob_name","chmodParams": 'r',         "editable": false, "showSort": true, "showFilter": true},                
            {"field": "lob_code","chmodParams": 'r',         "editable": false, "showSort": true, "showFilter": true},
            {"field": "department_name","chmodParams": 'r',  "editable": false, "showSort": true, "showFilter": true},
            {"field": "department_code","chmodParams": 'r',  "editable": false, "showSort": true, "showFilter": true},
            {"field": "specialty_name","chmodParams": 'r',   "editable": false, "showSort": true, "showFilter": true},
            {"field": "specialty_code","chmodParams": 'r',   "editable": false, "showSort": true, "showFilter": true},
            {"field": "cost_center_name","chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true},
            {"field": "cost_center_code","chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true},
            {"field": "npi","chmodParams": 'r',              "editable": false, "showSort": true, "showFilter": true},
            {"field": "employee_number", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true},



            {"field": "appointment_id", "headerName": "AppointmentId", "editable": false, "showSort": true, 
                "showFilter": true, "isRequired": true, "chmodParams": 'rw',
            },
            {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
            {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
            {"field": "is_active",   "dataType": "boolean", "editable": false, "chmodParams": 'r', "defaultFilter": "true"},


            {"field": "_ag-meta_", 
                'cellEditorParams': {
                    "allowDelete": {'update': false,  'insert': false}, //shows delete for pulled data only (has precedence)
                    "allowUndo":   {'update': true,  'insert':  true}, //shows undo for insert and update  (has precedence)
                    "allowCopy":   {'update': false,  'insert': false}, //show + for copy row.
                    "allowRemove": {'update': false,  'insert': false}
                }
            },
        ],
        "routeParams": {
            "default_route":   "data/provider_effort/appointment_effort_byuser_uv", //,
            'select': {'route':"data/provider_effort/appointment_effort_dateset_byuser_rv/select"},
            'insert': {'route':""},
            'update': {'route':"data/provider_effort/appointment_effort_byuser_uv/insert", "crudType": 'insert'},
            'delete': {'route':""}
        }
    }
]}

module.exports = appointment_effort_dateset