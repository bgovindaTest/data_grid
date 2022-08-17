let appointments = {
    "grids": [
        {
            "navHeaderParams": {
                "links": [{'name':'providers', 'url': '/providers'}]
            },
            "columnDefs": [
                {"field": "last_name", "valueGetter":"lookup(provider_id,   'last_name')",  "editable": false, "showSort": true, "showFilter": true, "isRequired": true},
                {"field": "first_name","valueGetter":"lookup(provider_id,   'first_name')", "editable": false, "showSort": true, "showFilter": true, "isRequired": true},
                {"field": "provider_id", "headerName": "employee_number", "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true,
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/providers_rv",
                        "columnDefs": [
                            {"field":'id'}, {"field":'last_name'}, {"field": 'first_name'},{"field": 'employee_number'},{"field": 'npi'}, ],
                        "displayKey": "employee_number"
                    }
                },

                {"field": "cost_center_id", "headerName": "CompanyCostCenterCode", "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true, "width": 380,
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/cost_center_rv",
                        "columnDefs": [
                                {"field": 'company_name'}, {"field": 'cost_center_name'},
                                {"field": 'lob_name'}, {"field": 'lob_code'},
                                {"field": 'department_name'}, {"field": 'department_code'},
                                {"field": 'specialty_name'}, {"field":  'specialty_code'},
                                {"field": 'org_name'}, 
                                {"field": 'id'}, 
                            
                            ],
                        "displayKey": "org_name"
                    }
                },
                {"field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true
                
            
                },
                {"field": "start_date", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},
                {"field": "end_date",   "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},



                {"field": "lcg_id", "headerName": "lcg_code", "editable": true, "showSort": true, 
                    "showFilter": true,
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/lcg",
                        "columnDefs": [
                            {"field":'id'}, {"field":'lcg_name', "width": 250}, {"field": 'lcg_code'}],
                        "displayKey": "lcg_code"
                    }
                },
                {"field": "cpsc_id", "headerName": "cpsc_code", "editable": true, "showSort": true, 
                    "showFilter": true, 
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/cpsc",
                        "columnDefs": [
                            {"field":'id'}, {"field":'cpsc_name', "width": 250}, {"field": 'cpsc_code'}],
                        "displayKey": "cpsc_code"
                    }
                },

                {"field": "lcg_name",   "valueGetter":"lookup(lcg_id,   'lcg_name')", "editable": false, "showSort": true, "showFilter": true },
                {"field": "cpsc_name",  "valueGetter":"lookup(cpsc_id, 'cpsc_name')", "editable": false, "showSort": true, "showFilter": true },
                {"field": "npi",        "valueGetter":"lookup(provider_id,   'npi')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "company_name", "valueGetter":"lookup(cost_center_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "company_code", "valueGetter":"lookup(cost_center_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true},

                {"field": "lob_name", "valueGetter":"lookup(cost_center_id,   'lob_name')", "editable": false, "showSort": true, "showFilter": true},                
                {"field": "lob_code", "valueGetter":"lookup(cost_center_id,   'lob_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "department_name", "valueGetter":"lookup(cost_center_id,    'department_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "department_code", "valueGetter":"lookup(cost_center_id,    'department_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "specialty_name", "valueGetter":"lookup(cost_center_id,     'specialty_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "specialty_code", "valueGetter":"lookup(cost_center_id,     'specialty_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "cost_center_name", "valueGetter":"lookup(cost_center_id,   'cost_center_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "cost_center_code", "valueGetter":"lookup(cost_center_id,   'cost_center_code')", "editable": false, "showSort": true, "showFilter": true},

                {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true }
    
            ],
            "routeParams": {
                "default_route": "data/provider_effort/appointments", //,
                'select': {'route':"data/provider_effort/appointments_rv/select"}
            },
        }
    ]}
    
module.exports = appointments