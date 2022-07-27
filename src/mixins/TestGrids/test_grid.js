let test_grid = {
"grids": [
    {
        "columnDefs": [
            {"field": "num", "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['num'] ,"validator":"ifnull(num,0)  > 0", 
                "editable": true, "defaultFilter": true, "showFilter": false, "showSort": true},
            {"field": "date", "cellEditor": 'dateTimeEditor', "dataType": "date", "editable": true},
            {"field": "num_+_1", "valueGetter": "ifnull(num,0) +1" , "validator": "ifnull(num,0) + 1 > 0"}
            // {"field": "full_name", "valueGetter": "ifnull(num,0) +1" , "validator": "ifnull(num,0) + 1 > 0"}


        ],
        "queryParams": {
            "default": "localhost:8080"
        },
        "tableData": [
            {"num": 0, "b":null},
            // {"a": 1, "b":'x'},
            // {"a": 2, "b":'y'},
            // {"a":-4, "b":'z'}
        ]
    }
]}

module.exports = test_grid