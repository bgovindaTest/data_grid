let app_user = {
    "grids": [
        {
            "navHeaderParams": {
                "links": [
                    {'name':'user_org_perms', 'url': '/admin/user_org_permsission'},
                ],
                "add_row": false
            },
            "columnDefs": [

                {"field": "last_name", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
                {"field": "first_name","chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
                {"field": "email","chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},

                {"field": "is_admin",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    'isRequired': true, "isLookup": true,
                    'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                        {'is_admin': 'true', 'id': 'true'} 
                        ,{'is_admin': 'false', 'id': 'false'}
                    ],'pullKey': "is_admin"}
                },

                {"field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    'isRequired': true, "isLookup": true,
                    'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                        {'is_active': 'true', 'id': 'true'} 
                        ,{'is_active': 'false', 'id': 'false'}
                    ],'pullKey': "is_active"}
                },
                {"field": "last_modified_userid", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "id", "chmodParams": 'rw', "editable": false, "showSort": true, "showFilter": true },
            ],
            "routeParams": {
                "default_route":   "data/app_admin/users",
            },
        }
    ]}
    
    module.exports = app_user