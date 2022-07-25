let test_grid = {
"grids": [
    {
        "columnDefs": [
            {"field": "a", "dataType": "numeric",  "editable": true, "defaultFilter": true, "showFilter": false, "showSort": true},
            {"field": "b", "editable": true, "defaultValue": "a"},
            {"field": "c", "valueGetter": "a +1", "validator": "a + 1 > 0"}

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