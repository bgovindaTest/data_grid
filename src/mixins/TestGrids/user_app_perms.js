let user_app_perms = {
    "grids": [
        {
            "navHeaderParams": {
                "links": [{'name':'providers', 'url': '/providers'}]
            },
            "columnDefs": [

                {"field": "last_name", "valueGetter":"lookup(user_id,   'last_name')",  "editable": false, "showSort": true, "showFilter": true},
                {"field": "first_name","valueGetter":"lookup(user_id,   'first_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "user_id", "headerName": "email", "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true,
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/app_admin/users_lv",
                        "columnDefs": [
                            {"field":'id'}, {"field":'last_name'}, {"field": 'first_name'},{"field": 'email'} ],
                        "displayKey": "email"
                    }
                },
                {"field": "app_id", "dataType": "integer", "editable": true, "showSort": true, "showFilter": true, "isRequired": true},
                {"field": "is_read_only", "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true},
                {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "id", "chmodParams": 'rw', "editable": false, "showSort": true, "showFilter": true },
            ],
            "routeParams": {
                "default_route":   "data/app_admin/user_app_permission",
                'select': {'route':"data/app_admin/user_app_permission_rv/select"}
            },
        }
    ]}
    
    module.exports = user_app_perms