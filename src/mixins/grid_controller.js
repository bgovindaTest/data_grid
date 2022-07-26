/*
This mix in is used in the Main.vue

It mainly calls the initialization scripts in GridPraser

Combines modules from GridFunctions and GridParser into main mixin

The grid functions module has functions for user changes to the grid. 

//has axios object in main plugin.
//dev vs prod


This module contains the code that is responsible for sending and receiving data to the server via
crud operations. This module provides the functions to pull data and saving data to the server.





Saving Data Returned From Server: Below is the structure of the return values. Its primarily meant to communciate what 
data failed to be saved and why. if is_eror is true the error_msg should be attached to the corresponding row based
on node_id. If there are error the grid will be set to display an error state where error messages are shown as the 
last column. All other grid functions will be disabled.



Common Inputs: 
axios object:
server params:
server route:
modalParams.loading
modalParams.saving
error state?
*/

/*
create subgrid functions

create crudColumn Functions

*/




//imports

const ColumnDefsInit = require('../lib/GridParser')
const data_config    = require('../lib/DataConfig')
const meta_column    = data_config.meta_column_name
let testGrid         = require('./TestGrids/test_grid')

var GridController = {

//props provide flags on calling mechanism. i.e. subgrid or
//main grid


// props: {
//     pageConfig: {
//         type: Object,
//         default: null
//     },
//     isSubModal: {
//         type: Boolean,
//         default: false
//     }

// },



data () {
    return {
        loading: true,
        is_test: true,
        is_development: true, //used file paths to laod data.
        is_read_only: false,


        url_params: {},
        global_params: {},

        //main_grid_params
        tableData: null,
        headerParams: null,
        columnDefs: null,
        gridApi: null,
        columnApi: null,
        gridOptions: null,

        //
        queryParams: {},
        orderByParams: {},
        filterParams: {},
        enforcedFilterParams: {},

        //data ready for save stored here. allows for save to continue
        toSave: [], //stores payload

        //functions created by gridParser
        gridFunctions: null,


        // gf['Insert']       = this.InsertRowInit(defaultValues) //for newly added rows via add row or new_sheet
        // gf['CopyRow']      = this.CopyRowInit()
        // gf['Update']       = this.UpdateRowInit() //for rows created from querying the database
        // gf['Undo']         = this.UndoRow() //function to reset row based on backup values
        // gf['Delete']       = this.DeleteRow()
        // gf['UndoDelete']   = this.DeleteUndoRow()
        // //grid_changes before saving
        // gf['CrudStatus']   = this.CrudStatus()

        // //delete_warning
        // gf['deleteWarning'] = grid['deleteWarning'] || ""


        // data() {
        //     return {
        //       columnDefs: null,
        //       rowData: null,
        //       showModal:true,
        //       modalx: {modal1: false},
        //       api: null,
        //       columnApi: null
        //     };
        //   },


        //modalParams
        saveModal: false,
        filterModal: false,
        orderByModal: false,

    }
},

async mounted () {
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
    //if submodal else.
    // if (this.is_development) {

    // }
    let main_grid = testGrid['grids'][0]
    let columnDefConfig = main_grid['columnDefs']
    let valuesObject = {}
    let cdi = new ColumnDefsInit(columnDefConfig, valuesObject)
    let px  = cdi.RunGridColumnsInit()
    this.AddMetaColumnFunctions(px['gridFunctions'], px['columnDefs'])

    const updx = px['gridFunctions']['Update']
    // return {'columnDefs': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}
    this.tableData  = main_grid['tableData']
    for (let i=0; i < this.tableData.length; i++) {
        let rdp = {}
        rdp['data']      = this.tableData[i]
        updx(rdp)
    }


    // console.log(this.tableData)
    this.columnDefs = px['columnDefs']
    // console.log(this.columnDefs)
    // columnDefs: null,



    // try {
        // let urlParams    = UrlParams()
        // let userPerms    = await this.UserPermissions(urlParams)
        // let pageConfig   = await this.PullPageConfiguration(urlParams)
        // if (this.is_read_only) {
            //if read only
            //create empty values object
            //set everything to editable: false



        // } else { 
        //     let valuesObject = await PullValuesObject(pageConfig) 
        // }
        //headerParams

        //gridParser
        //gridFunctions


        //ValueObject

        //If readonly




        // this.page_status.initial_loading = false


        //Pull Init data?

    // } catch (err) {
    //     // console.log(err)
    //     // throw err
    //     this.page_status.initial_loading_error = String(err)
    // }
},




methods: {
    /*
        Initialization functions

    */
    AddMetaColumnFunctions(gridFunctions, columnDefs) {
        /*
            This adds functions created in CrudColumn/crud_functions to crudColumn parameters.
            Creates CopyAddRow which requires references to main grid
        */
        const MetaFunctions = gridFunctions
        let mc = null
        for (let i =0; i< columnDefs.length; i++) {
            let grid_column = columnDefs[i]
            let field = grid_column['field']
            if (field === meta_column) {
                mc = grid_column
                break
            }
        }
        if (mc===null) {return}
        let cep = mc['cellEditorParams']
        cep['gridFunctions'] = MetaFunctions


        // gf['Insert']       = this.InsertRowInit(defaultValues) //for newly added rows via add row or new_sheet
        // gf['CopyRow']      = this.CopyRowInit()
        // gf['Update']       = this.UpdateRowInit() //for rows created from querying the database
        // gf['Undo']         = this.UndoRow() //function to reset row based on backup values
        // gf['Delete']       = this.DeleteRow()
        // gf['SetDelete']       = this.DeleteRow()
        // gf['UndoDelete']   = this.DeleteUndoRow()
        // gf['SetDelete']    = this.SetDelete()
    },

    UrlParams() {
        // https://flaviocopes.com/urlsearchparams/
        let url = window.location.href
        let urlx = new URL(url)
        let path = urlx.pathname
        let tmp  = path.split('/')
        let projectFolder = "" //tmp[0]
        let tableName     = "" //tmp[1]
        if (tmp.length >= 2) {
            projectFolder = tmp[0]
            tableName = tmp[1]
        } else if (tmp.length === 1) { tableName = tmp[0] }
        return {'projectFoldect': projectFolder, 'tableName': tableName}
    },

    //is root


    onGridReady(params) {
        this.gridApi     = params.api
        this.columnApi   = params.columnApi
        this.gridOptions = params
        //add active state updates
        // getRowHeight: params => params.node.group ? 50 : 20,
    },

    ParsePageConfig() {
        //{'columnDef': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}


    },

    GetRowHeight(params) {
        /* <ag-grid-vue
            :getRowHeight="getRowHeight"
            other grid options ... 
        </ag-grid-vue> */


        // params.node.group ? 50 : 20,
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
        const insertf  = gridFunctions['Insert']
        let newRowData = insertf({})
        this.gridApi.applyTransaction({'add':[newRowData]})
    },


    NewSheet() {
        /* Creates blank sheet for adding data */
        let pageSize = this.pageParams['limit']
        let rows = []
        const insertf  = gridFunctions['Insert']
        for (let i =0; i < pageSize; i++) {
            let newRowData = insertf({})
            rows.push( newRowData )
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
            for (var rowIndex = rowRange.startRow; rowIndex <= rowRange.endRow; rowIndex++) {
                var rowModel = api.getModel()
                var rowNode = rowModel.getRow(rowIndex)
                var rowx = rowNode.data
                if (bool_value) { deletef({'data': rowx}) }
                else { undo_deletef({'data': rowx})  }
            }
            api.refreshCells()
        } catch (err) {
            console.log("delete failed. lingering selection the likely cause after using view")
        }
    },


    InsertSelected(rowData, gridOptions, new_input_params) {
        //used to delete rows in add dat
        //check if allow delete.
        //button function
        var api = gridOptions.api
        var rangeSelection = api.getCellRanges()
        if (rangeSelection.length === 0) { return }
        rangeSelection = rangeSelection[0]
        var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var numNewRows = (endRow-startRow) +1
        insert(rowData, numNewRows, gridOptions, new_input_params, false)
    },


    RemoveSelected(rowData, gridOptions) {
        //removes row from grid. Adds indicator to row which is then spliced out
        //check if allow delete.
        //button function
        try {
            var api = gridOptions.api
            var rangeSelection = api.getCellRanges()
            if (rangeSelection.length === 0) { return }
            rangeSelection = rangeSelection[0]
            var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
            var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
            for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                var rowModel = api.getModel()
                var rowNode = rowModel.getRow(rowIndex)
                var rowx = rowNode.data
                rowx['__is_set_for_removal__'] = true
            }
            var i = 0;
            while (i < rowData.length) {
            if (rowData[i].hasOwnProperty('__is_set_for_removal__') ) {
                rowData.splice(i, 1);
            } else {
                ++i;
            }
            }
            redraw_rows(gridOptions)
        } catch (err) {
            console.log("remove failed. lingering selection the likely cause after using view")
        }
    },


    /*
        Loading modules
        save_route format json object
        {
            "error": {
                "is_error": false,
                "error_msg": ""
            },
            "output": {
                "insert": [
                    {
                        "is_error": true,
                        "node_id": 23,
                        "error_msg": "insert not allowed for users table. in route users for client row 23",
                        "id": -1
                    }
                ],
                ]
            },
            "table_name": "users",
            "route_name": "users"
        }
    */



    //CRUD Operations
    async RunPullQuery() {
        /*
        This is the first function needed to run data pull from the server. The query_names come from the selected query_route in the
        Query Types modal window. The where, order_by and pagination modules are pulled from the objects to create the query params object
        to send to the server. field_variables contains parameters needed to process the data pulled for the server to be added to the
        client grid. 
    
    
    
        Errors handled in navbar component.
    
        initialize get_route_params when initial RunQuery is ran.
        */

        //query_loading modal launch
        //other buttons dont run during loading?


    
        var dx = await axios_object.post(server_route,server_params)

        //push to table?
        /*
            Loops through all the data pulled from the server and appends default parameters needed to populate the
            grid with the correct functionaliaty
        */
        var processedRowData = []
        for (let i =0; i < serverRowData.length; i++ ) {
            let rowx = ServerRowDefaultValues(serverRowData[i], input_params, field_variables)
            processedRowData.push(rowx)
        }
        //api.setRowData(processedRowData)

    },
    
    async SaveData( saveRows, save_route, server_fields, field_map, autocomplete_map, axios_object, saveModalParams  ) {
        /*
        This funciton processes the rows for saving into the final form. Each row is sent to its specific saving route in
        req_body object. A temporary object is created row_map which stores a temporary node_id value -> save_row. This
        is used to allow the returned output to be matched to the saveRow so an error message can be added to it if the
        row fails to be saved.
    
        Date fields are changed to YYYY-MM-DD format. Autocomplete fields are processed to return the value generally the
        id needed to save to the server.
        */
    
        var req_body = {
            // 'user_id': 1,
            'insert': [], 'update': [],
            'upsert': [], 'delete': []
        }
        row_map = {} // node_id -> saveRow
        //has row_error = ?
        var count = 0
        // var row_error_map = {}


        for (let i=0; i< tableData.length; i++) {
            //allow ui to refresh for batch value changes
            batch_count += 1
            if (batch_count > 1000) {
                batch_count = 0
                await new Promise(r => setTimeout(r, 20))
            }
        }




        for(let i =0; i <saveRows.length; i++ ) {
            let rowx = saveRows[i]
    
            if(rowx[field_functions.is_deleted()] )  {
                count +=1
                req_body['delete'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'delete') )
    
            } else if(rowx[field_functions.save_route()] === 'insert' )  {
                count +=1
                req_body['insert'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'insert') )
    
            } else if(rowx[field_functions.save_route()] === 'update' )  {
    
                count +=1
                req_body['update'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'update') )
    
            }  else if(rowx[field_functions.save_route()] === 'upsert' )  {
    
                count +=1
                req_body['upsert'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'upsert') )
            } else {
                rowx['node_id'] = -1
            }
    
            if (count > 100 ) {
                UpdateModalSaveInformation(saveModalParams, req_body, count)
                await SendSaveDataAndProcessError(save_route, req_body, row_map, saveModalParams, axios_object)
                // UpdateModalRowErrorInformation(saveModalParams, row_error_map)
                //save data
                //count error messages
                //process errors
                count = 0
                req_body['insert'] = [] 
                req_body['update'] = []
                req_body['upsert'] = []
                req_body['delete'] = []
            }
        }
        if (count > 0) {
            UpdateModalSaveInformation(saveModalParams, req_body, count)
            await SendSaveDataAndProcessError ( save_route, req_body, row_map, saveModalParams, axios_object )
            // UpdateModalRowErrorInformation(saveModalParams, row_error_map)
        }
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


    FixData() {
        //clear save object.
        //close save modal
    },
    ContinueSave() {
        //continues save 
    },
    EndSave() {
        //reset save object
    }

}

}

module.exports = GridController