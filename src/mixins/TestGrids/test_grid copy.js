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
            {"field": "some_date","editable": true, "showSort": true, "showFilter": true, "dataType": "date",
                "cellEditor": 'dateTimeEditor', 'chmodParams': 'c'  },

        ],
        "routeParams": {
            "default_route": "data/provider_effort/company"
        }
    }
]}

module.exports = test_grid