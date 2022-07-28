let test_grid = {
"grids": [
    {
        "columnDefs": [
            {"field": "num", "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['num'] ,"validator":"ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": false, "showSort": true},
            {"field": "date", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true},
            {"field": "num_+_1",   "valueGetter": "ifnull(num,0) +1" , "validator": "ifnull(num,0) + 1 > 0"},
            {"field": "full_name", "cellEditor": 'agRichSelectCellEditor', "editable": true, "isLookup": true,
                "cellEditorParams": {
                    "valuesObject": [
                        {"full_name": "B G", "first_name": "B", "last_name": "G", "id": "1"},
                        {"full_name": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2"},
                        {"full_name": "Time Drake", "first_name": "Tim", "last_name": "Drake", "id": "3"},
                    ]
                }
            },
            {"field": "first_name_lookup", 'valueGetter': 'lookup(full_name, "first_name")' },
            {"field": "links","cloneOnCopy": true, 'cellRenderer': "LinksRenderer" },
            {"field": "full_namex", 'cellEditor': "autoCompleteEditor", "editable": true,
                "validator": "islookup(full_namex)",
                "cellEditorParams": {
                    "valuesObject": [
                        {"full_namex": "B G", "first_name": "B", "last_name": "G", "id": "1"},
                        {"full_namex": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2"},
                        {"full_namex": "Time Drake", "first_name": "Tim", "last_name": "Drake", "id": "3"},
                    ],
                    "columnDefs": ["full_namex", "first_name", "last_name", "id"]
                }
            }
        ],
        "queryParams": {
            "default": "localhost:8080"
        },
        "tableData": [
            {
                "num": 0, "links": {"urlPath": "/fakePath/home", "urlName": "LinksTest"},
                "full_name": {"full_name": "Sean Govi", "first_name": "Sean", "last_name": "Govi", "id": "5"},
                "auto": null,
                "full_namex": null,
                "date": null
            },
        ]
    }
]}

module.exports = test_grid