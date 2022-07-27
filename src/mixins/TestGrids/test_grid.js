let test_grid = {
"grids": [
    {
        "columnDefs": [
            // {"field": "num", "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['num'] ,"validator":"ifnull(num,0)  > 0", 
            //     "editable": true, "defaultFilter": true, "showFilter": false, "showSort": true},
            // {"field": "date", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true},
            // {"field": "num_+_1",   "valueGetter": "ifnull(num,0) +1" , "validator": "ifnull(num,0) + 1 > 0"},
            {"field": "full_name", "cellEditor": 'agRichSelectCellEditor', "editable": true, "isLookup": true,
                "cellEditorParams": {
                    "valuesObject": [
                        {"full_name": "B G", "first_name": "B", "last_name": "G", "id": "1"},
                        {"full_name": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2"},
                        {"full_name": "Time Drake", "first_name": "Tim", "last_name": "Drake", "id": "3"},
                    ]
                }
            },
            // {"field": "first_name_lookup", 'valueGetter': 'lookup(full_name, "first_name")' }



        ],
        "queryParams": {
            "default": "localhost:8080"
        },
        "tableData": [
            {"num": 0, "b":null, "full_name": null},
            // {"a": 1, "b":'x'},
            // {"a": 2, "b":'y'},
            // {"a":-4, "b":'z'}
        ]
    }
]}

module.exports = test_grid