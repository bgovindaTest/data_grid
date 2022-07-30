let test_grid = {
"grids": [
    {
        "columnDefs": [
            {"field": "num", "headerName": "Number",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['num'] ,"validator":"ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": true, "showSort": true},
            {"field": "date", "headerName": "Date", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},
            {"field": "num_+_1",   "valueGetter": "ifnull(num,0) +1" , "validator": "ifnull(num,0) + 1 > 0"},
            {"field": "full_name", "cellEditor": 'agRichSelectCellEditor', "editable": true, "isLookup": true, "showSort": true,"showFilter": true,
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
            {"field": "full_namex", 'cellEditor': "autoCompleteEditor", "editable": true, "showSort": true,
                "validator": "islookup(full_namex)",
                "cellEditorParams": {
                    "valuesObject": [
                        {"full_namex": "B G", "first_name": "B", "last_name": "G", "id": "1"},
                        {"full_namex": "Peter Brunn", "first_name": "Peter", "last_name": "Brunn", "id": "2"},
                        {"full_namex": "Time Drake", "first_name": "Tim", "last_name": "Drake", "id": "3"},
                    ],
                    "columnDefs": ["full_namex", "first_name", "last_name", "id"]
                }
            },
            {"field": "datetime", "headerName": "DateTime", "cellEditor": 'dateTimeEditor', "dataType": "datetime",
                "editable": true, "showSort": true, "showFilter": true},
            {"field": "time", "headerName": "Time", "cellEditor": 'dateTimeEditor', "dataType": "time",
                "editable": true, "showSort": true, "showFilter": true},

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
                "date": null,
                "datetime": null,
                "time": null
            },
        ]
    }
]}

module.exports = test_grid