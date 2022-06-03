/*

    'qparams_prefix':"",
    'url_prefix':"",
    '__init_params__':  {},
    '__url_params__': {},
    '__is_read_only__':  true/false (do the have modification permssions)
        //if no force editable to false

    //parse for static dropDowns (api route only)

    //first grid is main. others can be called as subgrids
    grids: [
        {'name': 'x'
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
        {'name': 'y'
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
    ]
//precedence

//UrlParams
//QueryParams
//GetJsonPageRoute
//add local params for later?

//_page_folder_
//_page_name_
// import from mdm_utlis
// meta_column_name

//into global object

*/


class InitializeParameters {
    constructor() {
        this.url  = null
        this.urlParams = null
        this.init_params = null
        this.is_read_only = null
        this.folderName = null
        this.pageName = null
    }
    async RunInitialization() {
        this.ParseUrlParams()
        await this.PullAppLayout()
        await this.LoadInitialParams()
        await this.DownloadStaticDropDowns()
        await this.CreateMainGrid()
    }

    ParseUrlParams() {}

    async PullAppLayout() {
        //parse url params
        //get jsonObject and user permissions
    }
    async LoadInitialParams() {}

    async DownloadStaticDropDowns() {}
    async CreateMainGrid() {}
    HeaderParams()
}