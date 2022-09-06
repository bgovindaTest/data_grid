/*
This mix in is used in the Main.vue
It mainly calls the initialization scripts in GridPraser
Combines modules from GridFunctions and GridParser into main mixin
The grid functions module has functions for user changes to the grid. 


This module contains the code that is responsible for sending and receiving data to the server via
crud operations. This module provides the functions to pull data and saving data to the server.

Saving Data Returned From Server: Below is the structure of the return values. Its primarily meant to communciate what 
data failed to be saved and why. if is_eror is true the error_msg should be attached to the corresponding row based
on node_id. If there are error the grid will be set to display an error state where error messages are shown as the 
last column. All other grid functions will be disabled.
*/


const ColumnDefsInit = require('../lib/GridParser')
const data_config    = require('../lib/DataConfig')
const meta_column    = data_config.meta_column_name
// let   testGrid       = require('./TestGrids/test_grid')
const RouteParams    = require('./RouteParser/RouteParams')
const axiosParams    = require('../axios_params')
const Pull           = require('./RouteParser/Pull') 
const Push           = require('./RouteParser/Push') 

var GridController = {

//props provide flags on calling mechanism. i.e. subgrid or
//main grid
props: {
    //has configuration object. 
    subGridPageConfig: {
        type: Object
    },
    mainGridRowData: {
        type: Object
    }
},
created() {
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No rows to show. You may lack permissions or your filters/pagination removed all rows.</span>';
},

data () {
    return {
        loading: true, //main_loading modal
        loading_error: "", //if not empty display error message during loading screen
        disable_navbar: false, // for pausing grid actions in navbar during loading
        
        /*

        */
        NODE_ENV: "", //test development production
        is_read_only: false,
        is_test: false,


        url_params: {},    //not implemented
        global_params: {}, //not implemented

        //main_grid_params
        tableData: null,
        navHeaderParams: {},
        columnDefs: null,
        gridApi: null,
        columnApi: null,
        gridOptions: null,

        //
        routeParams: null,
        pageParams: {},
        orderByParams: {},
        filterParams: {},


        //functions created by gridParser
        gridFunctions: null,

        valuesObject: {}, //contains values for lookups
        //boolean values for modal

        queryModal: false,
        filter_active: true, //if false use orderby
        helpModal: false,
        help_msg: "# No Help Message",

        /*
            Parameters below control save modal and corresponding messages and 
            buttons displayed for it.
        */
        saveParams: {},
        saveData: [],
        saveModal: false, //launches saveModal
        saveLock: false, //prevents modal from being closed
        isValidating: false,
        isSaving: false, //for displaying saving on loading button
        showButtons: false,
        showContinue: false,
        saveMainMessage: "",
        saveDeleteMessage: "",
        saveUniqueMessage: "",

        //for snackbar
        saved: 0,
        rejected: 0,
        snackBarVisible: 'hidden' //'hidden' //must be hidden or visible
    }
},
computed: {
    page_number() {
        //displayed in navbar to show current page
        let page_index = this.pageParams['page_index']
        return page_index + 1
    }
},

methods: {
    /*
        Initialization functions
    */
    SubGridInit() {
        //parses props initializes fields
    },
    async MainGridInit() {
        /*
        This object is ran to initialize all the required data from the server. When all initial loading is complete the 
        main page with the nav bar, grid and footer will be displayed. The order of the initializations matter.

        MainPage
            1. GetRoute
            2. Pull Configuration
            3. Pull and create ValueObject
            4. Parse Grid Configurations
            5. TurnLoading off
            6. Load Table Data
        SubPage
            1. Parse Sub Grid Configurations
            2. Turn Loading off
            3. LoadData

        */

        //wrap in big try catch for loading screen
        try {
            this.SetEnvironment()
            this.SaveParamsInit()
            let main_grid = await this.PullAndParsePageConfig()
            if (this.loading_error != "") {
                // stop loading display error mesage
                return
            }
            //pull url params

            // let main_grid   = testGrid['grids'][0]
            let is_read_only = this.is_read_only//false //true
            // this.is_test = true

            let routeParams = main_grid['routeParams'] || {}

            let navHeaderParams = main_grid['navHeaderParams'] || {}
            let columnDefConfig = main_grid['columnDefs']
            await this.ValuesObjectParser(0, columnDefConfig)
            let valuesObject = this.valuesObject[0]
            let cdi = new ColumnDefsInit(columnDefConfig, valuesObject)
            let px  = cdi.RunGridColumnsInit()
    
            //Initialize routes
            let rpx = new RouteParams(routeParams, px['columnDefs'], axiosParams.baseUrl)
            rpx.RouteParamsInit()
            this.routeParams = routeParams


            this.columnDefs    = px['columnDefs']
            this.gridFunctions = px['gridFunctions']
            this.LinkUIQueryParams(px['queryParams'])
            this.NavHeaderParamsInit(navHeaderParams, is_read_only)
            if (this.NODE_ENV === 'development' && main_grid.hasOwnProperty('tableData') ) {
                this.LoadTestData(main_grid)
            } else { this.LoadDataInit() }

            this.SetColumnsReadOnly(is_read_only)

            if (this.loading_error === "") {
                // load grid
                this.loading = false
                if (this.is_test) {
                    alert('grid in test mode no saving will occur. Data will be logged to console')
                }
            }
        } catch (e) {
            console.log(e)
            this.loading_error = String(e)
        }
    },
    SetColumnsReadOnly(is_read_only) {
        //not change cell colors. Need to check.
        if (! is_read_only) { return }
        let cdefs = this.columnDefs
        let mc = data_config['meta_column_name']
        for( let i =0; i < cdefs.length; i++ ) {
            let cdef = cdefs[i]
            if (cdef['field'] === mc ) {
                cdef['hide'] = true
            }
            if(!cdef.hasOwnProperty('editable')) { continue }

            let ex = cdef['editable']
            if (typeof ex === 'function') {
                cdef['editable'] = function (params) {return false}
            } else { cdef['editable'] = false }
        }
    },
    LinkUIQueryParams( queryParams ) {
        /*
            Adds query params to main grid
        */
        this.pageParams     = queryParams['pageParams']
        this.filterParams   = queryParams['filterParams']
        this.orderByParams  = queryParams['orderByParams']
    },
    async ValuesObjectParser(gridIndex, columnDefs) {
        /*
            gridIndex: positions of columnDefs in pageParams array
            columnDefs: definititions for a grid at the given index

        */
        let lookupEditors = data_config.cellEditors.lookupEditors
        this.valuesObject[gridIndex] = {}
        let baseUrl = axiosParams.baseUrl
        for(let i =0; i < columnDefs.length; i++) {
            let columnDef = columnDefs[i]
            let field      = columnDef['field']
            let cellEditor = columnDef['cellEditor'] || ""
            if (! lookupEditors.includes(cellEditor)) {continue}
            if (! columnDef.hasOwnProperty('cellEditorParams')) {continue}
            let cep = columnDef['cellEditorParams']
            let vx        = cep['valuesObject'] || []
            let api_route = cep['api_route']    || ""
            if (api_route === null || api_route === "") {
                this.valuesObject[gridIndex][field] = vx
                continue
            }
            if (! api_route.startsWith('http') ) { api_route = this.PathJoin(baseUrl, api_route ) }
            try {
                let axios_object = await this.axios.get(api_route)
                let api_data = axios_object.data
                this.valuesObject[gridIndex][field] = api_data['output_data']
            } catch (e) {
                console.error(e)
                let api_data = []
                this.valuesObject[gridIndex][field] = api_data
            }
        }
    },
    NavHeaderParamsInit(navHeaderParams, is_read_only = false) {
        /*
            Initialization nav header params for navbar functionality
        */
        let defaultNavHeaderParams ={
                'home': true,
                'help': true,
                'links': [],// or object array. 
                'previous_page':  true, //for pagination
                'next_page':  true, //for pagination
                'pull_data':  false, //for pagination
                'page_number': true,
                'save':  true,
                'add_row':   true,
                'new_sheet': false,
                'load_data_init': true,
                'is_test': false
        }
        navHeaderParams['is_test'] = this.is_test

        let keys = Object.keys(defaultNavHeaderParams)
        for(let i =0; i < keys.length; i+=1 ) {
            let key = keys[i]
            if (! navHeaderParams.hasOwnProperty(key)) { navHeaderParams[key] = defaultNavHeaderParams[key] }
        }
        //remove buttons on read only
        if (is_read_only) {
            navHeaderParams['add_row'] = false
            navHeaderParams['save'] = false
            navHeaderParams['new_sheet'] = false
        }

        //add links
        let homeRoute = {'name': "Home", 'url': '/'}
        if(navHeaderParams['links'] === null ) {
            navHeaderParams['links'] = []
            this.navHeaderParams = navHeaderParams
            return
        } else if (navHeaderParams['home'] === false ) {
            this.navHeaderParams = navHeaderParams
            return   
        }
        let links = navHeaderParams['links']
        let home_hit = false
        for(let i =0 ; i < links.length; i++ ) {
            let link = links[i]
            if (link.name === 'Home') { 
                home_hit = true
                break
            }
        }        
        if (! home_hit ) { links.unshift(homeRoute) }
        this.navHeaderParams = navHeaderParams
    },
    RunColumnDefsInit() {
        let main_grid = testGrid['grids'][0]
        let columnDefConfig = main_grid['columnDefs']
        let valuesObject = {}
        let cdi = new ColumnDefsInit(columnDefConfig, valuesObject)
        let px  = cdi.RunGridColumnsInit()
        // this.AddMetaColumnFunctions(px['gridFunctions'], px['columnDefs'])
  
        const updx = px['gridFunctions']['Update']
        // return {'columnDefs': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}
        this.tableData  = main_grid['tableData']
        for (let i=0; i < this.tableData.length; i++) {
            let rdp = {}
            rdp['data']      = this.tableData[i]
            updx(rdp)
        }
        this.columnDefs = px['columnDefs']
    },
    UrlParams() {
        // https://flaviocopes.com/urlsearchparams/
        let url = window.location.href
        let urlx = new URL(url)
        let path = urlx.pathname
        let tmpx  = path.split('/')
        let tmp = []
        for (z of tmpx) { if (z != "") { tmp.push(z) } }

        let projectFolder = "" //tmp[0]
        let tableName     = "" //tmp[1]
        let route = ""
        // console.log('url_params')
        // console.log(path)
        if (tmp.length >= 2) {
            projectFolder = tmp[0]
            tableName = tmp[1]
            route = projectFolder +'/' + tableName
            // console.log(tmp)
            // console.log(route)
        } else { route = "home_page/home_page" }
        //if tmp.length === 0  //is_root
        return {'projectFoldect': projectFolder, 'tableName': tableName, 'route': 'grid/'+ route}
    },
    onGridReady(params) {
        this.gridApi     = params.api
        this.columnApi   = params.columnApi
        this.gridOptions = params
    },
    async PullAndParsePageConfig() {
        /*
            rowSelectStyle: xx
            navHeaderParams:
            'queryParams'
            'columnDefs'
            //{'columnDef': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}
            //project_name, table_name, is_public, is_read_only
        */
        let routeParams = this.UrlParams()
        let route = routeParams['route']

        let baseUrl = axiosParams.baseUrl
        if (baseUrl.slice(-1) === '/') {
            route = baseUrl + route
        } else { route = baseUrl + '/' + route}

        // console.log(route)

        try {
            let dx = await this.axios.get(route)
            let x = dx.data
            // console.log(typeof x)
            // console.log(x)
            if (typeof x === 'string' || x instanceof String) {
                this.loading_error = x 
            } 
            if( Array.isArray(x) ) {
                if (x.length === 0) {
                    throw "Permission denied. No configurations sent. Check route is valid other wise contact admin"
                }
            }
            let px = x[0]
            /*
            id, is_read_only, is_test, page_config, page_config.comments === help_msg


            */
            let page_config = px['page_config'] || {}
            // console.log(page_config)

            this.is_read_only = px['is_read_only'] || false
            this.is_test      = px['is_test']      || false

            let main_grid = page_config['grids'][0] || {}
            this.help_msg = main_grid['comments'] || "# No Help Message"

            return main_grid
        }
        catch (e) {
            console.log(e)
            this.loading_error = String(e)
        }

    },
    FilterModal() {
        this.queryModal = true
        this.filter_active= true //if false use orderby
    },
    OrderByModal() {
        this.queryModal = true
        this.filter_active= false //if false use orderby
    },
    GetRowHeight(params) {
        /* 
            Returns row height
        */
        const rh = this.gridFunctions['RowHeight']
        return rh(params)
    },
    async AppendStaticDropDown() {
        //runs after gridParser. pull any static arrays?
    },
    /*
        //UI functions
    */
    async GetGridConfigurations() {},

    async GetValueObject() {},

    AppendRows( rowDataArray, row_index=null ) {
        /*
        This add new rows to the main tableData object in aggrid. array of rows
        and starting index optional
        */
        if( row_index === null ){ this.api.applyTransaction({'add':rowDataArray}) } 
        else {  this.api.applyTransaction({'add':rowDataArray, 'addIndex': row_index}) }
    },
    AddRow() {
        //button push
        const insertf  = this.gridFunctions['Insert']
        let newRowData = insertf({})
        this.gridApi.applyTransaction({'add':[newRowData], 'addIndex': 0 })
    },
    NewSheet() {
        /* Creates blank sheet for adding data */
        let pageSize = this.pageParams['limit']
        let rows = []
        const insertf  = this.gridFunctions['Insert']
        let k = 0
        for (let i =0; i < pageSize; i++) {
            let newRowData = insertf({})
            rows.push( newRowData )
            k += 1
            if (k >= 1000) {break}
        }
        this.gridApi.setRowData(rows)
    },
    GetRangeSelection() {
        let api = this.gridApi
        let rangeSelection = api.getCellRanges()
        if (rangeSelection.length === 0) { return {'startRow': 0, 'endRow': 0} }
        rangeSelection = rangeSelection[0]
        let startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        let endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        return {'startRow': startRow, 'endRow': endRow}
    },
    UndoSelected() {
        /*
        undo loops through all rows that have been highlighted when undo function is selected
        and runs UndoRow on them. This replaces the current values with those stored in the backup
        paramters.
        */
        try{
            let api = this.gridApi
            let rowRange = this.GetRangeSelection()
            const undof  = gridFunctions['Undo']
            for (let rowIndex = rowRange.startRow; rowIndex <= rowRange.endRow; rowIndex++) {
                var rowModel = api.getModel()
                var rowNode = rowModel.getRow(rowIndex)
                var rowx = rowNode.data
                undof({'data': rowx}) //gridFunctions?
            }
            api.refreshCells()
        } catch (err) {
            console.error("undo faild. lingering selection the likely cause after using view")
        }
    },
    SetDeleteSelected(bool_value) {
        //used to delete rows in add dat
        //check if allow delete.
        //button function
        // console.log('Delete function')

        // gf['Delete']       = this.DeleteRow()
        // gf['UndoDelete']   = this.DeleteUndoRow()
        try {
            let api = this.gridApi
            let rowRange = this.GetRangeSelection()
            const deletef  = gridFunctions['Delete']
            const undo_deletef  = gridFunctions['UndoDelete']
            for (let rowIndex = rowRange.startRow; rowIndex <= rowRange.endRow; rowIndex++) {
                let rowModel = api.getModel()
                let rowNode = rowModel.getRow(rowIndex)
                let rowx = rowNode.data
                if (bool_value) { deletef({'data': rowx}) }
                else { undo_deletef({'data': rowx})  }
            }
            api.refreshCells()
        } catch (err) {
            console.log("delete failed. lingering selection the likely cause after using view")
        }
    },
    InsertSelected() {
        //used to delete rows in add dat
        //check if allow delete.
        //button function
        let rowRange = this.GetRangeSelection()
        const insertf  = gridFunctions['Insert']
        let newRows = []
        for (let rowIndex = rowRange.startRow; rowIndex <= rowRange.endRow; rowIndex++) {
            newRows.push( insertf({}) )
        }
        this.AppendRows( newRows, row_index=rowrange.startRow )
    },
    RemoveSelected() {
        //removes row from grid. Adds indicator to row which is then spliced out
        //check if allow delete.
        //button function
        try {
            let rowRange = this.GetRangeSelection()
            let api = this.gridApi
            let rows = []
            for (let rowIndex = rowRange.startRow; rowIndex <= rowRange.endRow; rowIndex++) {
                let rowModel = api.getModel()
                let rowNode = rowModel.getRow(rowIndex)
                let rowx = rowNode.data
                rows.push(rowx)
            }
            this.api.applyTransaction({'remove': [rows] })

        } catch (err) {
            console.log("remove failed. lingering selection the likely cause after using view")
        }
    },
    async LoadDataInit() {
        /*
            initial data pull based on grid configurations. runs on page load.
        */
        let pullx = this.PullParamsObject()
        let req_body = pullx.GetRouteParams()
        req_body['crud_type'] = 'select'
        let route = this.routeParams['select']['route']
        try{
            let tableData = await this.RunTableDataQuery(pullx, route, req_body)
            this.tableData = tableData
            // console.log(tableData)
        } catch (e) {
            console.error(e)
            this.loading_error += String(e)
            //loading faild
        }
    },
    PullParamsObject () {
        /*
            Initializes object used to create parameters for select query
        */
        let cdef = this.columnDefs
        let p    = this.pageParams
        let o    = this.orderByParams
        let f    = this.filterParams
        let pullx = new Pull(cdef, f, o ,p)
        pullx.PullParamsInit()
        return pullx
    },
    async RunTableDataQuery(pullParams, route, req_body) {
        /*
            This is the first function needed to run data pull from the server. The query_names come from the selected query_route in the
            Query Types modal window. The where, order_by and pagination modules are pulled from the objects to create the query params object
            to send to the server. field_variables contains parameters needed to process the data pulled for the server to be added to the
            client grid. 
        */
        let gfu   = this.gridFunctions['Update']
        let axios_object = await this.axios.post(route, req_body)
        let x = axios_object.data
        let serverTableData = x['output_data']
        let tableData = []
        for(let i = 0; i < serverTableData.length; i++) {
            let serverRow = serverTableData[i]
            let rowData   = pullParams.QueryToRowData(serverRow)
            gfu({'data': rowData})
            tableData.push(rowData)
            await this.TimeOut(i, 1000)
        }
        return tableData
    },
    LoadTestData(main_grid) {
        const updx = this.gridFunctions['Update']
        this.tableData  = main_grid['tableData']
        for (let i=0; i < this.tableData.length; i++) {
            let rdp = {}
            rdp['data']      = this.tableData[i]
            updx(rdp)
        }
    },
    LogTestData() {
        try {
            let x = []
            this.gridOptions.api.forEachNode((rowNode, index) => { x.push(rowNode.data) })
            console.log(x)
        } catch (e) {
            console.log(e)
        }
    },

    async PreviousPage() {
        if (this.pageParams['page_index'] <=0 ) { 
            return 
        }
        this.AgridLoadingModal()
        let pullx = this.PullParamsObject()
        let req_body = pullx.PreviousPageParams()
        req_body['crud_type'] = 'select'
        let route = this.routeParams['select']['route']
        try{
            let tableData = await this.RunTableDataQuery(pullx, route, req_body)
            this.tableData = tableData
            if (tableData.length === 0) {this.AgridNoRowsModal()
            } else { this.AgridHideModal() }
        } catch (e) {
            console.error(e)
            alert(String(e))
            this.AgridHideModal()
        }
    },
    async NextPage() {
        this.AgridLoadingModal()
        let pullx = this.PullParamsObject()
        let req_body = pullx.NextPageParams()
        req_body['crud_type'] = 'select'
        let route = this.routeParams['select']['route']
        try{
            let tableData = await this.RunTableDataQuery(pullx, route, req_body)
            this.tableData = tableData
            if (tableData.length === 0) {this.AgridNoRowsModal()
            } else { this.AgridHideModal() }
        } catch (e) {
            console.error(e)
            alert(String(e))
            this.AgridHideModal()
        }
    },
    async RunNewQuery() {
        this.CloseQueryModal()
        this.AgridLoadingModal()
        let pullx = this.PullParamsObject()
        let req_body = pullx.NewQueryParams()
        req_body['crud_type'] = 'select'
        let route = this.routeParams['select']['route']
        try{
            let tableData = await this.RunTableDataQuery(pullx, route, req_body)
            this.tableData = tableData
            if (tableData.length === 0) {this.AgridNoRowsModal()
            } else { this.AgridHideModal() }
        } catch (e) {
            console.error(e)
            alert(String(e))
            this.AgridHideModal()
        }
    },
    CloseQueryModal() {this.queryModal = false},
    AssembleMutationQuery( ) {
        //combines req_body with routeParams
    },
    SaveParamsInit() {
        /*

            saveLock: locks save modal when true. Prevents it from closing. When false. Continue (if true)
                and close buttons will show. And modal can be closed. 
        */
        //validation_complete
        let save_count = {'is_save': 0, 'is_warning': 0, 'is_delete': 0, 
            'is_empty': 0, 'is_changed': 0, 'is_error': 0, 'is_complete': 0,
            'is_incomplete': 0, 'is_changed_error': 0, 'is_changed_warning': 0
        }
        let keys = Object.keys(save_count)
        for (let i =0; i < keys.length; i++) {
            let kx = keys[i]
            this.saveParams[kx] = save_count[kx]
        }
        this.saveLock     = false
        this.showContinue = false
        this.isValidating = false
        this.showButtons  = false
        this.saveModal    = false

        this.saveMainMessage = ""
        this.saveDeleteMessage = ""
        this.saveUniqueMessage = ""


        //AssemblePushPayloads adds reqbody and route informations.
        this.saveData = []
    },
    SnackBarInit() {
        //reset snackbar parameters
        this.saved = 0
        this.rejected = 0
        this.snackBarVisible = 'hidden'
    },
    MainSaveMessage(msg) { this.saveMainMessage = msg},
    ChangeSaveState(showButtons, saveLock, showContinue, isValidating) {
        //boolean values only controls save modal display
        this.showButtons     = showButtons
        this.saveLock        = saveLock
        this.showContinue    = showContinue
        this.isValidating    = isValidating
    },
    CloseSaveModal() {
        this.saveLock  = false
        this.saveModal = false
    },
    async SaveData() {
        /*
        This funciton processes the rows for saving into the final form. Each row is sent to its specific saving route in
        req_body object. A temporary object is created row_map which stores a temporary node_id value -> save_row. This
        is used to allow the returned output to be matched to the saveRow so an error message can be added to it if the
        row fails to be saved.
    
        Date fields are changed to YYYY-MM-DD format. Autocomplete fields are processed to return the value generally the
        id needed to save to the server.

        use save route or individual routes.

        //clearSaveData
        */
        try{
            let save_data = { 'insert': [], 'update': [], 'delete': [] }
            this.SaveParamsInit()
            this.SnackBarInit()

            this.saveModal    = true //launches saveModal
            this.saveLock     = true //prevents modal from being closed
            this.isValidating = true
            //allows ui to refresh
            await new Promise(r => setTimeout(r, 50))

            let save_count = this.saveParams
            const deleteWarning    = this.gridFunctions['deleteWarning']
            const uniqueWarning    = this.gridFunctions['uniqueWarning'] 
            const CrudStatus       = this.gridFunctions['CrudStatus']
            const SaveStatusCount  = this.SaveStatusCount
            const SaveDataAssembly = this.SaveDataAssembly

            let k = 0
            this.gridOptions.api.forEachNode((rowNode, index) => {
                k+=1
                let rowData = rowNode.data
                let rowStatus = CrudStatus(rowData)
                SaveStatusCount(rowStatus, save_count)
                SaveDataAssembly(rowData, rowStatus, save_data)
                //add timeout?

            });
            await this.AssemblePushPayloads(save_data)
            this.MainSaveMessage("No changes detected.")
            // console.log(this.saveMainMessage)

            let sx = save_count
            let changed_rows = `Rows Changed. changed: ${ sx['is_changed'] }
                incomplete: ${sx['is_incomplete']}  warning: ${sx['is_changed_warning']} errors: ${sx['is_changed_error']} <br />
            `
            let all_rows = `All Displayed Rows. warning: ${sx['is_warning']} errors: ${sx['is_error']}`

            if (this.is_test) {
                let test_msg = `Number Saving Rows: ${ sx['is_save'] } <br .> Deleted ${sx['is_delete']} <br />` + changed_rows + all_rows
                this.MainSaveMessage(`Test Saving Rows: ${ test_msg }.  Potentially saved data logged to console. Press pull to reset.`)
                this.TestSaveData()
                this.ChangeSaveState(true, false, false, false)
                return
            }
            if (this.is_read_only) { return }


            // let cstr = `changed: ${sx['is_changed']} saving: ${sx['is_save']}  warning: ${sx['is_warning']} errors: ${sx['is_error']} <br />`

            if (sx['is_save'] > 0 && sx['is_warning'] === 0 && sx['is_error'] ===0 ) {

                this.MainSaveMessage(`Number Saving Rows: ${ sx['is_save'] }`)
                this.saveDeleteMessage        = deleteWarning
                this.saveUniqueMessage        = uniqueWarning
                await new Promise(r => setTimeout(r, 500))
                await this.SaveAndReload()
            }
            else if (sx['is_changed'] === 0) {
                this.MainSaveMessage("No changes detected.")
                this.ChangeSaveState(true, false, false, false)
            }

            //pause save option to 
            else if ( sx['is_save'] > 0 && ( sx['is_warning'] > 0 || sx['is_error'] > 0 ) ) {
                let wstr = `Changes detected for saving. However, some rows either have errors or warnings.
                    Press close to fix or continue to ignore. Rows with errors will be skipped. <br />
                    Number Saving Rows: ${ sx['is_save'] } <br />
                    ${changed_rows}
                    ${all_rows}
                `
                this.MainSaveMessage( wstr )
                this.saveDeleteMessage        = deleteWarning
                this.saveUniqueMessage        = uniqueWarning
                this.ChangeSaveState(true, false, true, false)

            } else if ( sx['is_changed'] >  0 || sx['is_delete'] >  0  ) {
                let wstr = `Changes detected. However, all changed rows either have errors or are incomplete and not valid for saving. <br />
                    Number Saving Rows: ${ sx['is_save'] } <br />
                    ${changed_rows}
                    ${all_rows}
                `
                this.MainSaveMessage(wstr)
                this.saveDeleteMessage        = deleteWarning
                this.saveUniqueMessage        = uniqueWarning
                this.ChangeSaveState(true, false, false, false)                

            } else {
                this.MainSaveMessage("Error: This message should not display. Please contact admin. <br />"+cstr)
            }
        } catch (e) {
            console.log(e)
            this.MainSaveMessage("Error: This message should not display. Please contact admin. <br />"+cstr)
            alert(e)
        } 

    },
    async AssemblePushPayloads( save_data) {
        /*
            Process rows for saving. Mainly used for convert lookup columns 
            to an id or another single value.

            adds rows to this.saveData
        */
        let columnDefs = this.columnDefs
        let pxv  = new Push(columnDefs)
        pxv.PushParamsInit()

        // console.log('pushParams')
        // console.log(pxv.pushFieldParams)
        // console.log(pxv.pushLookupParams)
        // console.log(pxv.pushValueGetters)
        // console.log(pxv.defaultValues)
        // console.log('EndPushParams')

        let save_data_processed = {}
        let crudTypes = Object.keys(save_data)
        let index = 0
        let routeParams = this.routeParams
        for (let i=0 ; i < crudTypes.length; i++ ) {
            let crudType = crudTypes[i]
            let tableData = []
            let save_rows = save_data[crudType]
            for (let j=0; j < save_rows.length; j++ ) {
                let rowData = save_rows[j]
                let rd = pxv.CreateRowDataOut(rowData, routeParams)
                tableData.push(rd)
                index += 1
                await this.TimeOut(index, 500)
            }
            save_data_processed[crudType] = tableData
        }
        // //assemble reqBody
        let reqbody = this.saveData
        //return {'reqBody': reqBody, 'route': route, 'crudType': crudType}
        reqbody.push( pxv.CreatePushPayload(routeParams, 'insert', save_data_processed['insert'] )  )
        reqbody.push( pxv.CreatePushPayload(routeParams, 'update', save_data_processed['update'] )  )
        reqbody.push( pxv.CreatePushPayload(routeParams, 'delete', save_data_processed['delete'] )  )
    },


    async TimeOut(index, batch_count) {
        /*
        Number of iterations before setting await. Allows UI to refresh. 
        index comes from a for loop index.

        */
        if (index % batch_count === 0) {
            await new Promise(r => setTimeout(r, 20))
        }
    },
    SaveStatusCount(rowStatus, save_count) {
        let save_params = ['is_save', 'is_warning', 'is_delete', 'is_empty', 'is_changed',
            'is_error', 'is_complete','is_incomplete', 'is_changed_error', 'is_changed_warning']
        for (let i =0; i < save_params.length; i++ ) {
            let sp = save_params[i]
            if (rowStatus[sp] === true) { save_count[sp] += 1 }
        }
    },
    async SaveAndReload() {
        this.saveLock = true
        let no_error = await this.PushSaveData()
        if (no_error === true) {
            this.saveLock  = false
            this.saveModal = false
            this.ShowSnackBar()
            let tmpFunc = this.HideSnackBar
            setTimeout(tmpFunc, 1000)
            await this.RunNewQuery()
        } else {
            this.saveLock  = false
        }
    },
    TestSaveData() {
        //mocks PushSaveData. logs data to console. check if saving is working
        try{
            let req_bodies = this.saveData
            let save_count = this.saveParams
            console.log(req_bodies)
            console.log(save_count)
            this.saveLock = false
            // save_count['is_validating'] = false 
            // save_count['is_saving']     = false
            // save_count['save_complete'] = true
            return true
        } catch (e) {
            console.log(e)
            this.MainSaveMessage("Error: This message should not display. Please contact admin. Run pull to repull data<br />"+String(e))
            this.ChangeSaveState(true, false, false, false)
            return false
        }
    },

    async PushSaveData() {
        //return {'reqBody': reqBody, 'route': route, 'crudType': crudType}
        try{
            let req_bodies = this.saveData
            let save_count = this.saveParams
            for (let i =0; i < req_bodies.length; i+=1 ) {
                let rx    = req_bodies[i]
                let route     = rx['route']
                let req_body  = rx['reqBody']
                let data = req_body['data']
                if (data.length === 0) {continue}
                let axios_object = await this.axios.post(route, req_body)
                let adata = axios_object.data
                this.saved     += adata['output_data'].length || 0
                this.rejected  += adata['error_data'].length  || 0
                if (adata['error_data'].length !== 0) {console.log( adata['error_data'] )}
                if (adata['server_error'] !== "") {console.log( adata['server_error'] )}
            }
            save_count['is_validating'] = true 
            save_count['is_saving']     = false
            save_count['save_complete'] = true
            return true
        } catch (e) {
            console.log(e)
            this.MainSaveMessage("Error: This message should not display. Please contact admin. Run pull to repull data<br />"+String(e))
            this.ChangeSaveState(true, false, false, false)
            return false
        }

        //continues save
    },

    async SaveDataAssembly(rowData, rowStatus, saveData) {
        /*
            Appends rowData ready to be saved to saveData object.
        */
        let isSave = rowStatus['is_save']
        if (isSave !== true ) {return}
        let validCrudTypes = ['insert', 'update', 'delete']
        let crudType = rowStatus['crudType']
        if (validCrudTypes.includes(crudType) ) {
            let is_delete = rowStatus['is_delete']
            if (is_delete === true ) {saveData['delete'].push(rowData) } 
            else { saveData[crudType].push(rowData) }
        } else { console.error('error processing data') }
    },
    SetEnvironment() {
        /*
            Sets behavior of grid based on node enviornment
        */
        let envx = process.env.NODE_ENV
        if ( ['development','test','production'].includes(envx) ) {
            this.NODE_ENV = envx
        } else {
            console.error(`Invalid node_env ${envx} setting environment to development`)
            this.NODE_ENV ='development'
        }
    },


    AgridLoadingModal() {
        this.disable_navbar = true
        this.gridApi.showLoadingOverlay();
    },
    AgridNoRowsModal() {
        this.gridApi.showNoRowsOverlay();
        this.disable_navbar = false
    },
    AgridHideModal() {
        this.gridApi.hideOverlay();
        this.disable_navbar = false
    },
    PathJoin(base, new_path) {
        let b_end     = base.charAt(base.length -1 )
        let new_1 =    new_path.charAt(0)
        if (b_end === '/') {
            if (new_1 === '/') {return base + new_path.substring(1)
            } else { return base  + new_path }
        } else {
            if (new_1 === '/') {return base + new_path
            } else { return base +'/' + new_path }
        }
    },
    HideSnackBar() {
        this.snackBarVisible = 'hidden'
    },
    ShowSnackBar() {
        this.snackBarVisible = 'visible'
    }



}

}

module.exports = GridController