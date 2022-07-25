let test_grid = {
"grids": [
    {
        "columnDefs": [
            {"field": "a", "dataType": "numeric","requiredFields": ['a'] ,"validator":"ifnull(a,0)  > 0",  "editable": true, "defaultFilter": true, "showFilter": false, "showSort": true},
            {"field": "b", "editable": true, "defaultValue": "a"},
            {"field": "c", "valueGetter": "ifnull(a,0) +1" , "validator": "ifnull(a,0) + 1 > 0"}

        ],
        "queryParams": {
            "default": "localhost:8080"
        },
        "tableData": [
            {"a": 0, "b":null},
            {"a": 1, "b":'x'},
            {"a": 2, "b":'y'},
            {"a":-4, "b":'z'}
        ]
    }
]}

module.exports = test_grid