let test_grid = {
"grids": [
    {
        "columnDefs": [

            {"field": "full_namex", 'cellEditor': "autoCompleteEditor", "editable": true, "showSort": true,
                'headerName': "ProviderName",
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

            {"field": "is_approved", "cellEditor": 'agRichSelectCellEditor', "editable": true, "isLookup": true, "showSort": true,"showFilter": true,
                "cellEditorParams": {
                    "valuesObject": [
                        {"is_approved": 'true', "id": "1"},
                        {"is_approved": 'false',"id": "2"},
                        {"is_approved": 'null',"id": "3"},
                    ]
                }
            },

            {"field": "date", "headerName": "EffectiveDate", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true, "showSort": true, "showFilter": true},


            {"field": "cfte",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['cfte'], //,"validator":"1 >= ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": true, "showSort": true},

            {"field": "veterans_affairs",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['veterans_affairs'], //,"validator":"1 >= ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": true, "showSort": true},
    
            {"field": "contract",   "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['contract'] ,//,"validator":"1 >= ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": true, "showSort": true},

            {"field": "academic",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['academic'] ,//,"validator":"1 >= ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": true, "showSort": true},

            {"field": "administrative",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['administrative'], //,"validator":"1 >= ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": true, "showSort": true},

                // {"field": "num_+_1",   "valueGetter": "ifnull(num,0) +1" , "validator": "ifnull(num,0) + 1 > 0"},

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
                "full_name": {"full_name": "Sean Govi", "first_name": "Sean", "last_name": "Govi", "id": "5"},
                "full_namex": null,
                "date": null,
                "is_approved": "false"
            },

            
        ]
    }
]}

module.exports = test_grid