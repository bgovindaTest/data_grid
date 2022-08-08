let test_grid = {
"grids": [
    {
        "navHeaderParams": {
            "links": [{'name':'providers', 'url': '/providers'}]
        },
        "columnDefs": [

            {"field": "full_name", 'cellEditor': "autoCompleteEditor", "editable": false, "showSort": true,
                'headerName': "ProviderName", "cloneOnCopy": true,
                "validator": "islookup(full_name)",
                // "cellEditorParams": {
                //     "valuesObject": [
                //         {"full_name": "B G", "first_name": "B", "last_name": "G", "id": "1"},
                //         {"full_name": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2"},
                //         {"full_name": "Time Drake", "first_name": "Tim", "last_name": "Drake", "id": "3"},
                //     ],
                //     "columnDefs": ["full_name", "first_name", "last_name", "id"]
                // }
            },
            {"field": "cost_center","headerName": "Cost Center", "valueGetter":"lookup(full_name, cc)", "editable": false },
            // {"field": "is_approved", "cellEditor": 'agRichSelectCellEditor', "editable": true, "isLookup": true, "showSort": true,"showFilter": true,
            //     "cellEditorParams": {
            //         "valuesObject": [
            //             {"is_approved": 'true', "id": "1"},
            //             {"is_approved": 'false',"id": "2"},
            //             {"is_approved": 'null',"id": "3"},
            //         ]
            //     }
            // },

            {"field": "date", "headerName": "EffectiveDate", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},


            {"field": "cfte",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['cfte'], "validator":"1 >= ifnull(cfte,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "veterans_affairs",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['veterans_affairs'],
                "validator":"1 >= ifnull(veterans_affairs,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},
    
            {"field": "contract",   "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['contract'] ,
                "validator":"1 >= ifnull(contract,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "academic",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['academic'] ,
                "validator":"1 >= ifnull(academic,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "administrative",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['administrative'],
                "validator":"1 >= ifnull(administrative,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "full_effort",   "valueGetter": "ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administrative,0) " ,
                "validator": "1>= ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administrative,0)  >=0"},

        ],
        "queryParams": {
            "default": "localhost:8080"
        },
        "tableData": [
            {
                "cfte": 0,
                "veterans_affairs": 0,
                "contract": 0,
                "academic": 0,
                "administrative": 0,
                "full_name": {"full_name": "John Smith", "first_name": "John", "last_name": "Smith", "id": "5", "cc": "cost center a"},
                "date": "2022-01-01",
                "is_approved": {"is_approved": 'false', "id": "2"}
            },
            {
                "cfte": 0.8,
                "veterans_affairs": 0,
                "contract": 0,
                "academic": 0,
                "administrative": 0,
                "full_name": {"full_name": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2", "cc": "cost center b"},
                "date": "2022-05-01",
                "is_approved": {"is_approved": 'false', "id": "2"}
            },
            {
                "cfte": 1,
                "veterans_affairs": 0,
                "contract": 0,
                "academic": 0,
                "administrative": 0,
                "full_name": {"full_name": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2", "cc": "cost center b"},
                "date": "2022-01-01",
                "is_approved": {"is_approved": 'false', "id": "2"}
            },
            {
                "cfte": 0,
                "veterans_affairs": 0,
                "contract": 0,
                "academic": 0,
                "administrative": 0,
                "full_name": {"full_name": "Brandon Govi", "first_name": "Brabdib", "last_name": "Govi", "id": "3", "cc": "cost center c"},
                "date": "2022-01-01",
                "is_approved": {"is_approved": 'false', "id": "2"}
            },            
        ]
    }
]}

module.exports = test_grid