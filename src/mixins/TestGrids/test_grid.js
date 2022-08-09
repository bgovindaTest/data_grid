let test_grid = {
"grids": [
    {
        "navHeaderParams": {
            "links": [{'name':'providers', 'url': '/providers'}]
        },
        "columnDefs": [

            {"field": "id", 'cellEditor': "autoCompleteEditor", "editable": false, "showSort": true,
                "cloneOnCopy": false, "showFilter": true
            },
            {"field": "company_name","editable": true, "showSort": true, "showFilter": true  },
            {"field": "company_code","editable": true, "showSort": true, "showFilter": true  },
            {"field": "is_active","editable": true, "showSort": true, "showFilter": true  }

        ],
        "routeParams": {
            "default_route": "data/provider_effort/company"
        },
        "tableData": [
            {
                "id": '1',
                "company_name": 'sup',
                "company_code": '0',
                "is_active": 'true'
            },
        ]
    }
]}

module.exports = test_grid