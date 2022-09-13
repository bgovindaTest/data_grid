const lob = {
    "comments": "List of line of business attached to company",
    "grids": [
        {
            "navHeaderParams": {
                "links": [
                    {'name':'company',          'url': '/provider_effort/company'},
                    {'name':'lob',              'url': '/provider_effort/lob'},
                    {'name':'department',       'url': '/provider_effort/department'},
                    {'name':'specialty',        'url': '/provider_effort/specialty'},
                    {'name':'cost_center',      'url': '/provider_effort/cost_center'},
                    {'name':'cost_center_time', 'url': '/provider_effort/cost_center_time'}                
                
                ]
            },
            "columnDefs": [
                { "headerName": "CompanyName",   "field": "company_name", "valueGetter":"lookup(company_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true,  "defaultSort": "asc"},
                { "headerName": "CompanyCode",   "field": "company_code", "valueGetter":"lookup(company_id,   'company_code')", "editable": false, "showSort": true, "showFilter": true },
                { "headerName": "Companyid",     "field": "company_id",  "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true,
                    "cellEditor": "autoCompleteEditor",
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/company_lv",
                        "columnDefs": [
                                {"field": "company_name"}, {"field": "company_code"},
                                {"field": "id"} 
                            ],
                        "displayKey": "id"
                    }
                },
                { "field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    "isRequired": true, "isLookup": true, "defaultFilter": "true",
                    "cellEditor": "agRichSelectCellEditor", "cellEditorParams": {"valuesObject": [
                        {"is_active": "true", "id": "true"},
                        {"is_active": "false","id": "false"}
                    ], 'pullKey': "is_active"}
                },
                { "headerName":  "LobName","field": "lob_name", "editable": true, "showSort": true, "showFilter": true, "defaultSort": "asc"},                
                { "headerName":  "LobCode","field": "lob_code", "editable": true, "showSort": true, "showFilter": true},
                {"field": "last_modified_user_email", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },

                { "field": "id", "chmodParams": "rw", "editable": false, "showSort": true, "showFilter": true }
            ],
            "routeParams": {
                "default_route": "data/provider_effort/line_of_business",
                "select": {"route":"data/provider_effort/line_of_business_rv/select"}
            }
        }
    ]
}

module.exports = lob