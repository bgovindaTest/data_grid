const company = {
    "comments": "List of all companies",
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
                { "headerName": "CompanyName",   "field": "company_name", "isRequired": true, "editable": true, "showSort": true, "showFilter": true, "defaultSort": "asc" },
                { "headerName": "CompanyCode",   "field": "company_code", "isRequired": true, "editable": true, "showSort": true, "showFilter": true },
                { "field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    "isRequired": true, "isLookup": true, "defaultFilter": "true",
                    "cellEditor": "agRichSelectCellEditor", "cellEditorParams": {"valuesObject": [
                        {"is_active": "true", "id": "true"},
                        {"is_active": "false","id": "false"}
                    ],'pullKey': "is_active" }
                },
                {"field": "last_modified_user_email", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "id", "chmodParams": "rw", "editable": false, "showSort": true, "showFilter": true }
            ],
            "routeParams": {
                "default_route": "data/provider_effort/company",
                'select': {'route':"data/provider_effort/company_rv/select"}
            }
        }
    ]
}

module.exports = company