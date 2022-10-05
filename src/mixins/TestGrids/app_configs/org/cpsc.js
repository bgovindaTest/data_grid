const cpsc = {
    "comments": "List of all cpsc",
    "grids": [
        {
            "navHeaderParams": {
                "links": [
                    {'name':'lcg',          'url': '/provider_effort/lcg'}                
                ]
            },
            "columnDefs": [
                { "headerName": "CpscName",   "field": "cpsc_name", "isRequired": true, "editable": true, "showSort": true, "showFilter": true, "defaultSort": "asc" },
                { "headerName": "CpscCode",   "field": "cpsc_code", "isRequired": true, "editable": true, "showSort": true, "showFilter": true },
                { "field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    "isRequired": true, "isLookup": true, "defaultFilter": "true",
                    "cellEditor": "agRichSelectCellEditor", "cellEditorParams": {"valuesObject": [
                        {"is_active": "true", "id": "true"},
                        {"is_active": "false","id": "false"}
                    ],'pullKey': "is_active" }
                },
                {"field": "updated_at", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "id", "chmodParams": "rw", "editable": false, "showSort": true, "showFilter": true }
            ],
            "routeParams": {
                "default_route": "data/provider_effort/cpsc"
            }
        }
    ]
}

module.exports = cpsc