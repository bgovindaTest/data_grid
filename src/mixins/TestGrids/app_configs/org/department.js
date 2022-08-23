const department = {
    "comments": "This is the main landing page for the app. ProjectFolderName TableName (as link) Description",
    "grids": [
        {
            "columnDefs": [
                { "headerName": "CompanyName", "field": "company_name", "valueGetter":"lookup(lob_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true,  "defaultSort": "asc"},
                { "headerName": "CompanyCode","field": "company_code", "valueGetter":"lookup(lob_id,   'company_code')", "editable": false, "showSort": true, "showFilter": true },
                { "headerName": "LobName", "field": "lob_name", "valueGetter":"lookup(lob_id,   'lob_name')", "editable": false, "showSort": true, "showFilter": true,  "defaultSort": "asc"},
                { "headerName": "LobCode", "field": "lob_code", "valueGetter":"lookup(lob_id,   'lob_code')", "editable": false, "showSort": true, "showFilter": true },
                { "headerName": "Lobid",     "field": "lob_id",  "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true,
                    "cellEditor": "autoCompleteEditor",
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/line_of_business_rv",
                        "columnDefs": [
                                {"field": "company_name"}, {"field": "company_code"},
                                {"field": "lob_name"},     {"field": "lob_code"},
                                {"field": "id"} 
                            ],
                        "displayKey": "lob_id"
                    }
                },

                { "headerName":  "DepartmentName","field": "department_name", "editable": true, "showSort": true, "showFilter": true,  "defaultSort": "asc"},                
                { "headerName":  "DepartmentCode","field": "department_code", "editable": true, "showSort": true, "showFilter": true},
                { "field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    "isRequired": true, "isLookup": true, "defaultFilter": "true",
                    "cellEditor": "agRichSelectCellEditor", "cellEditorParams": {"valuesObject": [
                        {"is_active": "true", "id": "true"},
                        {"is_active": "false","id": "false"}
                    ]}
                },

                {"field": "last_modified_user_email", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                { "field": "id", "editable": false, "showSort": true, "showFilter": true, "chmodParams": "rw" }
            ],
            "routeParams": {
                "default_route": "data/provider_effort/department",
                "select": {"route":"data/provider_effort/department_rv/select"}
            }
        }
    ]
}

module.exports = department