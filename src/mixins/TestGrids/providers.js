let providers = {
"grids": [
    {
        "navHeaderParams": {
            "links": [{'name':'providers', 'url': '/providers'}]
        },
        "columnDefs": [

            {"field": "last_name",  "editable": true, "showSort": true, "showFilter": true, "isRequired": true},
            {"field": "first_name", "editable": true, "showSort": true, "showFilter": true, "isRequired": true},
            {"field": "npi",        "editable": true, "showSort": true, "showFilter": true, "isRequired": true},
            {"field": "employee_number", "editable": true, "showSort": true, "showFilter": true, "isRequired": true},
            {"field": "classification_id", "headerName": "classification", "editable": true, "showSort": true, 
                "showFilter": true, "isRequired": true,
                "cellEditor": 'autoCompleteEditor',
                "cellEditorParams": {
                    "api_route": "data/provider_effort/classifications",
                    "displayKey": "classification_name"
                }
            },
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
            {"field": "start_date", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},
            {"field": "end_date",   "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},
            {"field": "lcg_name",   "valueGetter":"lookup(lcg_id,   'lcg_name')",    "editable": false, "showSort": true, "showFilter": true },
            {"field": "cpsc_name",  "valueGetter":"lookup(cpsc_id, 'cpsc_name')", "editable": false, "showSort": true, "showFilter": true },
            {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
            {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
            {"field": "id", "chmodParams": 'rw', "editable": false, "showSort": true, "showFilter": true },

        ],
        "routeParams": {
            "default_route": "data/provider_effort/providers", //,
            'select': {'route':"data/provider_effort/providers_rv/select"}
        },
    }
]}

module.exports = providers