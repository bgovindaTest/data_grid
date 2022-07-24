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




var GridController = {

    // Grid Function
    // redraw_rows: refresh UI of grid
    // remove_row_data: removes all rows from grid
    // append_rows: adds new rows to grid
    // new_sheet: creates an empty sheet.
    // undo: runs UndoRow on all selected rows.
    // UndoRow: Returns a given rows server fields to original values
    // Delete: runs SetDelete on all selected rows
    // SetDelete: sets __is_delete__ variable to (true/false) on a given row
    // insert: main insert function
    // InsertSelected: insert the number of rows highlighted
    // CreateNewRow: creates a new row. 
    // server_error_display:
    
    // Inputs:
    // gridOptions: Required by ag-grid contains api often set to gridApi
    // gridColumnApi: Required by ag-grid
    // gridParams:
    // rowData:



//props provide flags on calling mechanism. i.e. subgrid or
//main grid
props: {
    pageConfig: {
        type: Object,
        default: null
    },
    isSubModal: {
        type: Boolean,
        default: false
    }

},



data () {
    return {
        loading: true,
        is_test: true,
        is_development: true, //used file paths to laod data.
        is_read_only: false,

        row_index: 0,

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



        //modalParams
        saveModal: false,
        filterModal: false,
        orderByModal: false,

    }
},

// 'qparams_prefix':"",
// 'url_prefix':"",
// '__url_params__': {},
// '__valuesObject__': [{}] //array is grid position object key is field and value is values to be passed.
// '__is_read_only__':  true/false (do the have modification permssions)
//     //if no force editable to false

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


    try {



        await this.UserPermissionsInitialize()
        this.gridParams['user_permissions'] = this.user_permissions
        //need to add user_permissions
        this.columnDefs = await grid_init.InitializeAggrid(this.gridParams, this.grid_column_rules, this.autocomplete_map, this.$axios)
        // console.log(this.columnDefs)
        field_functions.InitalizeRowCreation(this.gridParams,this.new_input_params, this.query_routes )
        this.QueryParamsInitialize()
        this.AddLocalData()
        this.page_status.initial_loading = false

        //CreateFunctionsParam Object
        //addParamsObject to cellEditorParams


        // console.log(this.autocomplete_map)
    } catch (err) {
        // console.log(err)
        // throw err
        this.page_status.initial_loading_error = String(err)
    }
},




methods: {
    onGridReady(params) {
        this.gridApi     = params.api
        this.columnApi   = params.columnApi
        this.gridOptions = params
        //add active state updates
    },

    ParsePageConfig() {
        //{'columnDef': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}


    },

    ResetIndex() {this.row_index = 0    },
    AddIndex()   {this.row_index += 0   },
    GetIndex()   {return this.row_index },

    async AppendStaticDropDown() {
        //runs after gridParser. pull any static arrays?
    },

    /*
        //UI functions



    */

    UrlParams() {},

    //is root

    async GetGridConfigurations() {},

    async GetValueObject() {},



    RedrawRows() {
        //redraws all visible rows gridOptions.api === gridApi
        // gridApi.redrawRows() --maynot be needed anymore
        this.gridApi.refreshCells()
    },

    RemoveTableData() {
        /*
        This function takes the rowData object and removes all rows without setting new object. This removes
        all rows without breaking linking to object throughout app

        rowData: main array for aggrid contains all table data
        */
        this.tableData.length = 0
    },



    ResetAllRowData() {
        //returns rowData to backup value. stored in metadata column
        for (let i=0; i< this.tableData.length; i++) {
            let rowData = this.tableData[i]
            this.UndoRow (rowData[i])
        }
        this.RedrawRows()
    },

    AppendRows( rows ) {
        /*
        This add new rows to the main tableData object in aggrid. Can accept and array of rows
        or just one json row.
        */
        if( Array.isArray(rows) ){
            for (let i = 0; i < rows.length; i++) {
                this.tableData.push(rows[i])
            }
        }
        else { this.tableData.push(rows) }
    },
    AppendRowsTop(rows ) {
        /*
        This add new rows to the main rowData object in aggrid. Can accept and array of rows
        or just one json row.
        */
        if( Array.isArray(rows) ){
            for (let i = 0; i < rows.length; i++) { this.tableData.unshift(rows[i]) }
        } else { this.tableData.unshift(rows) }
    },

    NewSheet() {
        /*
        Get page limit size from pagination?
        //check if valid. If not get default 1k?
        */
        var pageSize = this.ReturnPageSize()
        var rows = []
        for (let i =0; i < pageSize; i++) {
            rows.push( this.CreateNewRow() )
        }
        this.RemoveTableData()
        this.AppendRows(rows)
        this.RedrawRows()
    },

    ReturnPageSize() {
        //Use page limit size from pagination to determine size of page.
        //For new sheet.
        let lx = this.pagination['limit']
        if (isNaN(lx)) {return 1000}
        return lx
    },

    Undo() {
        /*
        undo loops through all rows that have been highlighted when undo function is selected
        and runs UndoRow on them. This replaces the current values with those stored in the backup
        paramters.
        */
        try{
            let api = this.gridApi
            var rangeSelection = api.getCellRanges()
            if (rangeSelection.length === 0) { return }
            rangeSelection = rangeSelection[0]
            var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
            var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
            var rowNodes = []
            for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                var rowModel = api.getModel()
                var rowNode = rowModel.getRow(rowIndex)
                var rowx = rowNode.data
                this.UndoRow(rowx) //gridFunctions?
                rowNodes.push(rowNode)
            }
            this.RedrawRows()
        } catch (err) {
            console.log("undo faild. lingering selection the likely cause after using view")
        }
    },


    UndoRow (rowx) {
        //set row data back to backup/original value
        //use columnDef parameter
        this.SetBackup(rowx)
        this.SetDelete(rowx, false)
    },

    SetBackup (rowx) {
        //returns all server fields to original values.

        //get from prams object
        for(var i = 0; i < server_fields.length; i++) {
            var key = server_fields[i] //change here
            var backupKey = field_functions.BackupFieldName(key)
            rowx[key]  = rowx[backupKey]
        }
    },


    Delete(bool_value) {
        //used to delete rows in add dat
        //check if allow delete.
        //button function
        // console.log('Delete function')
        try {
            let api = this.gridApi
            var rangeSelection = api.getCellRanges()
            if (rangeSelection.length === 0) { return }
            rangeSelection = rangeSelection[0]
            var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
            var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
            var rowNodes = []
            for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                var rowModel = api.getModel()
                var rowNode = rowModel.getRow(rowIndex)
                var rowx = rowNode.data
                //rowData['delete'] = "Delete"
                SetDelete(rowx, bool_value)
                rowNodes.push(rowNode)
            }
            api.redrawRows({'rowNodes': rowNodes})
        } catch (err) {
            console.log("delete failed. lingering selection the likely cause after using view")
        }
    },

    SetDelete(rowx, bool_value) {
        //is delete changes allowed?
        //Need to check delete param. SetDelete, SetUnmodified and SetModified used to track which rows have been edited
        //This is used to determine if selecting an Edit/Add tab will be allowed b/c only one
        //Modification allowed at a time

        //set delete column to false?
    },




    Insert(rowData, num_rows, gridOptions, new_input_params, add_top=false) {
        /*
        // check what happens to NodeId after insert?
        Refrences:
        // https://stackoverflow.com/questions/38505806/add-remove-rows-in-ag-grid/38949539
        // https://stackoverflow.com/questions/57463050/how-to-find-out-the-index-of-a-selected-row-of-a-ag-grid
        */
        var rows = []
        for (let i =0; i < num_rows ; i++) {
            rows.push(CreateNewRow(new_input_params))
        }
        if (add_top) {
            append_rows_top(rowData, rows )
        } else {
            append_rows(rowData, rows)
        }
        if (rows.length > 0) {
            redraw_rows(gridOptions)
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


    CreateNewRow(new_input_params) {
        /*
        This creates a new row object. The intial default values are stored in gridParams['insert_row_params']
        */
        var new_row = {}
        for (let key in new_input_params) {
            new_row[key] = new_input_params[key]
        }
        return new_row
        //rowData.splice(targetIndex, 0, newRow);
    },

    QueryRouteRowInputsInitialize(query_row_inputs) {
        /*
        This function finish initializing the default parameters in query_row_inputs. This object is used to add default parameters 
        to each row for data pulled from the server. A common change is to set what route the row will goto on save. The default route is update.
        */
        var default_params = field_functions.DefaultUpdateRouteParameters()
        for (let key in default_params) {
            if (query_row_inputs.hasOwnProperty(key)) {continue}
            query_row_input[key] = default_params[key]
        }
    },

    ServerErrorDisplay(gridOptions,is_error) {
        /*
        //used to hid show error
        //This function hides columns based on which tab is selected.
        //lastUpdatedBy shown on View and Edit Tab
        //status is only show for edit tab 
        */

        var gridColumnApi = gridOptions.columnApi
        gridColumnApi.setColumnVisible(field_functions.server_error(), is_error)
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
    async RunQuery(route_name, query_routes, where, order_by, pagination, get_route_params,field_variables, axios_object,is_next_page) {
        /*
        This is the first function needed to run data pull from the server. The query_names come from the selected query_route in the
        Query Types modal window. The where, order_by and pagination modules are pulled from the objects to create the query params object
        to send to the server. field_variables contains parameters needed to process the data pulled for the server to be added to the
        client grid. 
    
        query_routes: { //need to have save route inorder to define how default values will be added
                'current_cfte(i)': {'route':'/route/path/insert', 'input_params': {'__save_route__': 'insert'} , 'description': 'New cfte. on save will try to create a new row'},
                'current_cfte(u)': {'route':'/route/path/update', 'input_params': {'__save_route__': 'update'} , 'description': 'current cfte. on save will try to update current row'},
                'new_providers': {'route':'/route/path/update', 'input_params': {'__save_route__': 'insert'} , 'description': 'Assigned providers without a cfte'},
                'default': {'route':'/route/path/update', 'input_params': {'__save_route__': 'update'} , 'description': 'Assigned providers without a cfte'},
                // 'save': //
        }
    
        [{'variable_name': , 'query_type': , 'value':  , 'data_type': ''}]
        New Sheet should also initialzie get_route_params. Need to reset grid_rout_params
    
        Errors handled in navbar component.
    
        initialize get_route_params when initial RunQuery is ran.
        */

        //query_loading modal launch
        //other buttons dont run during loading?

        var query_object = query_routes[route_name]
        if (!is_next_page) {
            //initialize get_route_params
            var queryParams = { 'where': where, 'order_by': order_by, 'pagination': pagination}
            var grid_query_params = qparams.CreateGetRouteParams(queryParams) 
            
            get_route_params['current_get_route'] = query_object['route']
            get_route_params['input_params'] = query_object['input_params']
            get_route_params['where']      = grid_query_params['where']
            get_route_params['order_by']   = grid_query_params['order_by']
            get_route_params['pagination'] = grid_query_params['pagination']
            get_route_params['route_name'] = route_name
        }
    
    
        var server_params = {
            'where': get_route_params['where'],
            'order_by': get_route_params['order_by'],
            'pagination': get_route_params['pagination']
            // 'user_id': 1
        }
        var server_route = query_object['route']
    
        var dx = await axios_object.post(server_route,server_params)
        var output = dx.data
        var processedOutput =  ProcessServerDataForAggrid(output['rows'], get_route_params['input_params'], field_variables)
        //if error throw?
    
        //remove tableData


        //add processedOutput


        return processedOutput
        //if no errors? else //Add error to loadModule?
    
        // clearRowData
        // appendData
    },
    
    ProcessServerDataForAggrid(serverRowData, input_params, field_variables) {
        /*
        Loops through all the data pulled from the server and appends default parameters needed to populate the
        grid with the correct functionaliaty
    
        */
        var processedRowData = []
        for (let i =0; i < serverRowData.length; i++ ) {
            let rowx = ServerRowDefaultValues(serverRowData[i], input_params, field_variables)
            processedRowData.push(rowx)
        }
        return processedRowData
    },

    ServerRowDefaultValues(serverRow, input_params, field_variables) {
        /*
        This function converts data pulled from the server into the required form for the client side.
        Need a timestamp component parser for updated_at.
        */
        //set default values
        var rowx = {}
        for (const key in input_params) {
            rowx[key] = input_params[key] 
        }
    
        var field_list = field_variables['fields']
        var field_map  = field_variables['field_map']
        // console.log(field_list)
        let server_columns_not_null = 0
        let total_server_columns = 0
        // console.log('wtf')
        // console.log(serverRow)
        for (let i=0; i< field_list.length; i++) {
            let field_name = field_list[i]
            if (serverRow.hasOwnProperty(field_name)) {
                // console.log('inside loop')
                let data_type = field_map[field_name]['data_type']
                var server_value = serverRow[field_name]
                if (data_type === 'date') {
                    server_value = ConvertServerDateToClientValue(server_value)
                }
                else if (data_type === 'autocomplete') {
                    if (typeof server_value === "boolean") {
                        server_value = String(server_value)
                    }
                } else if (data_type === 'boolean') {
                    server_value = String(server_value)
                }
    
                //if boolean convert to string
                total_server_columns += 1
                if (server_value === null ) {server_columns_not_null += 1}
                rowx[field_name] = server_value
                rowx[field_functions.BackupFieldName(field_name)] = server_value
            }
        }
        if (serverRow.hasOwnProperty('allow_update')) {
            rowx[field_functions.allow_update()] = serverRow['allow_update']
        }
        if (serverRow.hasOwnProperty('allow_delete')) {
            rowx[field_functions.allow_delete()] = serverRow['allow_delete']
        }
        if (serverRow.hasOwnProperty('is_assigned')) {
            rowx[field_functions.is_assigned()] = serverRow['is_assigned']
        }
    
        if (server_columns_not_null > 0 && server_columns_not_null === total_server_columns) {
            rowx[field_functions.is_empty()      ] = false
            rowx[field_functions.is_complete()   ] = true
            rowx[field_functions.is_incomplete() ] = false
        } else if (server_columns_not_null === 0 ) {
            rowx[field_functions.is_empty()      ] = true
            rowx[field_functions.is_complete()   ] = false
            rowx[field_functions.is_incomplete() ] = false
        } else {
            rowx[field_functions.is_empty()      ] = false
            rowx[field_functions.is_complete()   ] = false
            rowx[field_functions.is_incomplete() ] = true
        }
        return rowx
    
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
        //if error AddServerErrorMessagesToRow field_functions.server_error()
        // AddServerErrorMessagesToRow(saveRows, row_error_map)
    },
    ExtractSaveParams(grid) {
        /*

            allowNull: true/false
            isRequired: true/false
            ignoreError: true/false (for calculated fields?) allow to pass or skip?
        */

        //isCrud or has validator
        let fields = []
        let fwarn = {} //need to get validation functions.
        let ferrs = {}
        let allowNull = {}
        let isRequired = {}
        let ignoreError = {}
        for(let i=0; i < grid.length; i++) {
            let isCrud     = false
            let hasValid   = false
            let grid_column = grid[i]
            let field = grid_column['field']
            let is_error = false
            let is_required = false

            if (grid_column.hasOwnProperty('isCrud')) { isCrud = grid_column['isCrud'] }
            if (grid_column.hasOwnProperty('validator')) { hasValid = true }
            if (!isCrud || !hasValid) { continue }
            fields.push(field)
            if (grid_column.hasOwnProperty('isRequired'))  { isRequired[field]  = grid_column['isRequired'] }
            if (grid_column.hasOwnProperty('ignoreError')) { 
                ignoreError[field] = grid_column['ignoreError']
                is_error = ignoreError[field]
            }
            if (grid_column.hasOwnProperty('allowNull'))   { 
                allowNull[field]   = grid_column['allowNull'] 
                is_required 
            }
            if (grid_column.hasOwnProperty('validator'))   { 
                
                //error or warning

                allowNull   = grid_column['allowNull'] 
            
            }

            // if (grid_column.hasOwnProperty('validator')) {}
        }

    },


    FixData() {
        //clear save object.
        //close save modal
    },
    ContinueSave() {
        //continues save 
    },
    UpdateSaveInfo() {
        saveModalParams['insert_count'] += req_body['insert'].length
        saveModalParams['update_count'] += req_body['update'].length
        saveModalParams['delete_count'] += req_body['delete'].length
        saveModalParams['upsert_count'] += req_body['upsert'].length
        saveModalParams['row_start'] += saveModalParams['row_end']
        saveModalParams['error_count'] += number_errors
        saveModalParams['row_end']   += save_count
    },
    
    async SendSaveDataAndProcessError ( save_route, req_body, row_map, saveModalParams, axios_object  ) {
        /*
            This is the main save function it sends the data in req_body to the server. Any rows that are rejected
            an error message is added the the saveRow through the row_map object. Also a count of rejected rows
            is passed to the saveModalParams.
        */
        // console.log(req_body)
        var dx = await axios_object.post(save_route, req_body)
        let dx_data = dx.data
        // console.log(dx_data)
        AppendErrorsToRowData(row_map, saveModalParams, dx_data['output'])
        if (dx_data['error']['is_error']) {
            throw new Error(dx['error']['error_msg'])
        }
    
    },
    ProcessData(rowx,row_map, node_id, server_fields, field_map, autocomplete_map, save_route) {
        /*
            ProcessData to be sent to the server.
            need to add node_id for filtering purposes?
    
            //loop through server fields only?
            field_map = gridParams[field_variables][field_map]
            //determine what route to append to based on the row data route. i.e.
            row_data[__is_deleted__] if no id ignore
            if __save_route__ == 'insert'
            for (let i = 0: i< row_data.length; i++ ) {
                var key
                if (!field_map.hasOwnProperty())
    {'field': "", 'backup_field': "", 'validation_field': "", 'data_type': "", 'is_server_field': false, 'has_validation': false }
            }
            //need to check length of object before appending?
        */
        var rowy = {}
        for (let i=0; i < server_fields.length; i++) {
            let field_name = server_fields[i]
            let lookup = field_map[field_name]
            let backup_field_name = lookup['backup_field']
            let data_type = lookup['data_type']
            let current_value = rowx[field_name]
            let backup_value = rowx[backup_field_name]
            //add node_id
            rowx['node_id'] = node_id
            rowy['node_id'] = node_id
            row_map[node_id] = rowx
            //
            if (save_route === 'update') { if (backup_value === current_value) {continue} }
            if (data_type === 'date') {
                current_value = ConvertDateValue(current_value)
                if (current_value === null ) {continue}
            }
            if (data_type === 'autocomplete') {
                let autocomplete_lookup = autocomplete_map[field_name]
                let crud_column_name = autocomplete_lookup['crud_value']
                let mfx = autocomplete_lookup['mapFunction']
                if (!mfx.hasOwnProperty(current_value)) {continue}
                current_value = mfx[current_value][crud_column_name]
                let return_field = autocomplete_lookup['return_field']
                if (return_field !== "") {field_name = return_field}
                //if autcomplete_lookup has return_field  then replace field with return field?
                //used when the name of the data being pulled is different than the save route?
            }
            rowy[field_name] = current_value
        }
    
        if (save_route === 'update' || save_route === 'delete') {
            //check type?
            rowy['id'] = rowx['id']
        }
        // rowy['last_modified_by_user_id'] = 1
    
        return rowy
    },

    async ExtractRowsForSave(rowData) {
        /*
        This extracts all completed rows that should be sent to the server for saving.
        */
        //need to update conditional. I dont think its right
        let saveRows = []
        for (let i=0; i<rowData.length; i++) {
            if ( IsSaveRow(rowData[i])
            
            ) { saveRows.push(rowData[i]) }
        }
        return saveRows
    },

    async IsSaveRow(grid_functions) {
        /*
        Filter passes if the row should be included for saving.
    
        If new row skip if deleted. if new row and is changed is complete and no error should pass
    
        if old row i.e. for update. Can change if 

        loop through everything and return crud params by type

        batch and debounce?
        */
        // {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
        // 'fdel': fdel, 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange }
        let IsChanged   = grid_functions['fchange']
        let IsCompleted = grid_functions['fcomp']
        let IsError     = grid_functions['ferror']
        let IsWarning   = grid_functions['fwarn']


        let incomplete = 0
        let errors     = 0
        let warnings   = 0
        let saves      = 0
        let save_object = {'insert': [], 'update': [], 'delete': [], 'error_count': errors,
            'incomplete_count': incomplete, 'warning_count': warnings, 'save_count': saves }

        let tableData = []
        batch_count = 0
        for (let i=0; i< tableData.length; i++) {
            //allow ui to refresh for batch value changes
            batch_count += 1
            if (batch_count > 1000) {
                batch_count = 0
                await new Promise(r => setTimeout(r, 20))
            }

            let rowData = tableData[i]
            if (! IsChanged(rowData) ) { continue }
            if ( this.IsDeleted(rowData) ) {
                save_object['delete'].push(rowData)
                continue
            }

            if (! IsCompleted(rowData)) {
                incomplete += 1
                continue
            }
            let is_error = IsError(rowData)
            if (is_error === false || is_error === null ) {
                let row_type = rowData[meta_column_name]['row_type']
                save_object[row_type].push(rowData)
                if (is_error === null) {errors +=1} 
            } else {errors += 1}
        }
    },

    /*
    CreateGetRouteParams takes the objects generated by the modal windows, parses them and preprocess the data type. If all values
    are valid its included in the final object. Else its excluded from the final object sent to the server.
    */
    CreateGetRouteParams(queryParams) {
        /*
        Pulls data rules and intializes paramters. queryParams is an object that contains the current values
        from all the modal windows.
        req_body from client has the following structure
        req.body['where'] = [{}]
        req.body['order_by'] = [{}]
        req.body['pagination'] = {}
        */

        //from QueryParser and current queryParams
        var req_body = {'where': [], 'order_by': [], 'pagination': {} }
        return req_body
    },



}

}

module.exports = GridController