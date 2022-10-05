const refreshed_dates = {
    "comments": "Used to set cfte reset date. The greatest date is used all others are ignored.",
    "grids": [
        {
            "columnDefs": [
                { "field": "check_date", "dataType": "date", "isRequired": true, "editable": true, "showSort": true, "showFilter": true, "defaultSort": "asc" },
                {"field": "id", "chmodParams": "rw", "editable": false, "showSort": true, "showFilter": true }
            ],
            "routeParams": {
                "default_route": "data/provider_effort/refreshed_dates"
            }
        }
    ]
}

module.exports = refreshed_dates