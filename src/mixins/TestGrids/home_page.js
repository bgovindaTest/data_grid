let home_page = {
    "grids": [
        {
            "navHeaderParams": {
                "links": [{'name':'providers', 'url': '/providers'}]
            },
            "columnDefs": [

                {"field": "project_name", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"field": "table_name", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"field": "description", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"field": "url_link", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true},
                {"field": "_ag-meta_", "allowAction": false, "hide": true}
            ],
            "routeParams": {
                "default_route":   "data/app_admin/home_page_rv"
            },
        }
    ]}
    

module.exports = home_page