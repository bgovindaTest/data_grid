const cost_center_time = {
    "grids": [
        {    
            "navHeaderParams": {
                "links": [{"name":"providers_cc", "url": "/providers"}]
            },
            "columnDefs": [


                {"field": "cfte_full_time" ,  "editable":true, "dataType": "numeric", "validator": "ifnull(cfte_full_time,0)  >=0",
                    "showSort": true, "showFilter": true},
                
                {"field": "time_unit_id", "headerName": "TimeUnit", "editable": true, "showSort": true, 
                "showFilter": true, "isRequired": true,
                "cellEditor": "autoCompleteEditor", 
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/time_unit",
                        "columnDefs": [
                            {"field":"id"}, {"field":"time_unit_name"}
                        ],
                        "displayKey": "time_unit_name"
                    }
                },
                {"headerName": "CompanyName","field": "company_name",     "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "CompanyCode","field": "company_code",     "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "CostCenterName","field": "cost_center_name", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "CostCenterCode","field": "cost_center_code", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "LobName","field": "lob_name",         "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},                
                {"headerName": "LobCode","field": "lob_code",         "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "DepartmentName","field": "department_name",  "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "DepartmentCode","field": "department_code",  "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "SpecialtyName","field": "specialty_name",   "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "SpecialtyCode","field": "specialty_code",   "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"headerName": "IsActive",    "field": "is_active",     "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},

                {"field": "last_modified_user_email", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at",     "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "cost_center_id", "chmodParams": "rw", "headerName": "CompanyCostCenter", "editable": false, "showSort": true},
                {"field": "id", "chmodParams": "rw", "editable": false, "showSort": true, "showFilter": true }
            ],
            "routeParams": {
                "default_route":   "data/provider_effort/cost_center_time",
                "select": {"route":"data/provider_effort/cost_center_time_rv/select"}
            }
        }
    ]
}

module.exports = cost_center_time