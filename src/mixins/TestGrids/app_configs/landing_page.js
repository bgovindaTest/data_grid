const home_page = {
    "comments": "This is the main landing page for the app. ProjectFolderName TableName (as link) Description",
    "grids": [
        {
            "navHeaderParams": { 'save':  false, 'add_row':  false },

            "columnDefs": [
                { "headerName": "ProjectName", "field": "project_name", "chmodParams": "r" },
                { "headerName": "TableName",   "field": "table_name", "chmodParams": "r" },
                { "headerName": "Description",   "field": "description", "chmodParams": "r" },

                { "headerName": "UrlLink",   "field": "url_link", "cellRenderer": "LinksRenderer", "cellEditor": "LinksRenderer", "chmodParams": "r" },
                {"field": "_ag-meta_", "allowAction": false, "hide": true}

    
            ],
            "routeParams": {
                "default_route": "data/app_admin/home_page_rv"
            }
        }
    ]
}
module.exports = home_page