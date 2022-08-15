let test_grid = {
"grids": [
    {
        "navHeaderParams": {
            "links": [{'name':'providers', 'url': '/providereffort/providers'}],
            'add_row':   true, 'new_sheet': true
        },
        "columnDefs": [

            {"field": "id",  "editable": false, "showSort": true, 'cellEditorParams': "autoCompleteEditor",
                "cloneOnCopy": false, "showFilter": true, 'chmodParams': 'rw'
            },
            {"field": "company_name","editable": true, "showSort": true, "showFilter": true  },
            {"field": "company_code","editable": true, "showSort": true, "showFilter": true  },
            {"field": "is_active","editable": true, "showSort": true, "showFilter": true  },
            // {"field": "some_date","editable": true, "showSort": true, "showFilter": true, "dataType": "date",
            //     "cellEditor": 'dateTimeEditor', 'chmodParams': 'c'  },

            {"field": "msg",  "editable": true, "showSort": true, 'cellEditor': "autoCompleteEditor",
                "cloneOnCopy": false, "showFilter": true, 'chmodParams': 'rc',
                'cellEditorParams': {
                    "api_route": "/data/public/dropx"
                    // "valuesObject": [
                    //     {"msg": 'true', "id": "1"},
                    //     {"msg": 'false',"id": "2"},
                    //     {"msg": 'null',"id": "3"}
                    // ]
                }


            }

        ],
        "routeParams": {
            "default_route": "data/provider_effort/company"
        },
        // "tableData": [
        //     {
        //         "id": '1',
        //         "company_name": 'sup',
        //         "company_code": '0',
        //         "is_active": 'true'
        //     },
        // ]
    }
]}

module.exports = test_grid