/*
Parses grids json object and converts expression syntax into javascript functions. 

    'qparams_prefix':"",
    'url_prefix':"",
    '__init_params__':  {},
    '__url_params__': {},
    '__drop_downs__': {},
    '__is_read_only__':  true/false (do the have modification permssions)
        //if no force editable to false

    //first grid is main. others can be called as subgrids
    grids: [
        {'name': 'x'
         'help': ""
        'headerParams': {links}
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
        {'name': 'y'
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
    ]

    crudRoute:
        default: ->
        select:  ->
        insert:  ->
        update:  ->
        delete:  ->

    crudInsteadOf: {
        'insert': 'update'
    }

gridOptions.suppressPropertyNamesCheck = true

validator: function()


//not implemented yet also need try catch console log error.
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
 
isCrud:   true/false
editable: true/false {'update_only': true/false, 'insert_only': true/false}


dataType:  //used for sorting? need to add time and datetime filters

allowNull: true/false
isRequired: true/false
ignoreError: true/false (for calculated fields?) allow to pass or skip?


ifNull: 'psql string calls to replace value'
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""

//need to add parameters to defaultValue and defaultFilter to deal with sub modal cases
//field determines which data to get from params.data in aggrid. key is if its an object.
defaultValue: {'value': 'string', 'type': '', 'key': '', 'field': '' } handle raw value or replacement from row params?
defaultOrderby: 'asc/desc' (done by column order in columnDefs)
defaultFitler: {'value': 'string/bool/', 'type': '', 'key': '', 'field': ''} type is 'raw'
    from: {'field'}

showFilter: default true (if false cant be changed) should hide from filter module
//need an enforce to prevent clear from working?
//if false dont allow clear.
showSort: default true (if false cant be used for sorting)

Responsible for creating valueGetter, valueSetter and valueFormatter
NativeFields: fields are not parsed. taken as is and passed to aggrid directly
    i.e. valueGetter = valueGetterNative
    valueGetterNative: 
    valueSetterNative: (optional) (grid_rules_object). Need to add for date column?
    valueFormatterNative: blah
    toolTipNative: expression for variables

hide - hides the field
suppressToolPanel - removes it from the tool panel.

pageParams (rowPrams: for subgrid)\
    globals:
    url_params:
    row_params: (available for subgrid )

primaryKey: 'default id'

AutoComplete and Aggrid PullDown:

AgGridRichSelect Editor flat data
staticDropDownKey: 'name of drop down'
staticDropDown: api or array of objects [{}]
staticDropDownFilters?

subgrid params (valid names and default)
*/
const ex = require('./ExpressionParser')
const cellClassRules = require('./ColumnDefs/CellClassRules')
const type_check = require('../TypeCheck')

const lodashCloneDeep = require('lodash.clonedeep')

const meta_column_name = '_ag-meta_'
const meta_delete_undo_name = '_ag-meta-delete-undo_'
//import axios
//create configurations.


//Creates main layout

class ColumnDefsInit {
    //for main loader
    //grid is json object for aggrid
    constructor(grid, pageParams, rowParams) {
        this.grid  = grid
        this.globals   = pageParams.globals || {}
        this.dropDowns = pageParams.dropDowns || {}
        this.urlParams = pageParams.urlParams || {}
        this.rowParams = rowParams || {}
    }
    RunGridInit() {
        //for MainGrid
        //make copy?
        //grid = JSON.parse(JSON.stringify(food)) for deep copy
        let grid = lodashCloneDeep(this.grid) //messes up column order probably?
        let defaultOrderBy  = []  //name value?
        let defaultFilter  = [] //name operator value

        //prepend delete_undo column
        InitializeDeleteUndoColumn(grid)
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            if (grid_column['field'] === meta_delete_undo_name ) { continue }
            this.ValueTransform(grid_column, 'valueGetter')
            this.ValueTransform(grid_column, 'valueSetter')
            this.ValueTransform(grid_column, 'valueFormatter')
            this.ValueTransform(grid_column, 'toolTip')
            this.IfNull(grid_column)
            this.IsEditable(grid_column)
            this.HideColumns(grid_column)
            this.Validators(grid_column)
            this.CellClassRules(grid_column)
            this.CellEditorParams(grid_column)
            this.DefaultOrderBy(grid_column,defaultOrderBy)
            this.DefaultFilter(grid_column,defaultFilter)
            this.DefaultValue(grid_column)
            this.DefaultParameters(grid_column)
            this.CellWidth(grid_column)
            this.AddValueSetter(grid_column)
        }
        this.MetaColumn(grid)
        //filterParams
        //SortByParams
        //HeaderParams
        return {'grid': grid, 'defaultSortBy': defaultSortBy, 'defaultFilter': defaultFilter}
    }
    RunSubGridInit(grid, rowParams) {
        //this.RunGridInit()
    }
    RunMainGridInit() {
        //grid_name or position
        //this.RunGridInit()
        //returns gridConfiguration
    }
    InitializeDeleteUndoColumn(grid) {
        /*
        Used to add delete/undo button to grid. Handles intialization parameters if provided.
        Sets paramaters on when to show the delete/undo options.
        */
        let du_column = {}
        let du_defined = false
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            if (grid_column['field'] === meta_delete_undo_name ) { //use cell editor?
                du_column  = grid_column
                du_defined = true
                break
            }
        }
        du_column['showSort']   = false
        du_column['showFilter'] = false

        //hide button if all false dont show
        if (du_column.hasOwnProperty('allowAction') ) { if (du_column['allowAction'] === false) {return} }
        //defaultParameters
        let headerName = 'GridAction'
        let defaultCellEditorParams = {
            "allowDelete":{'update': true, 'insert': false}, //shows delete for pulled data only (has precedence)
            "allowUndo": {'update': true,  'insert': true} //shows undo for insert and update  (has precedence)
        }
        if (!du_column.hasOwnProperty('headerName') ) { du_column['headerName'] = headerName }        
        if (!du_column.hasOwnProperty('cellEditor') ) { du_column['cellEditor'] = 'deleteUndoSelector' }        
        if (!du_column.hasOwnProperty('cellEditorParams') ) {
            du_column['cellEditorParams'] = defaultCellEditorParams
            if (!du_defined) { grid.unshift(du_column) }
            return
        }
        let duc = du_column['cellEditorParams']
        if (duc.hasOwnProperty('allowDelete') ) {
            let ducx = duc['allowDelete']
            if (! ducx.hasOwnProperty('update') ) {ducx['update'] = defaultCellEditorParams['allowDelete']['update'] }
            if (! ducx.hasOwnProperty('delete') ) {ducx['delete'] = defaultCellEditorParams['allowDelete']['delete'] }
        } else { duc['allowDelete'] = defaultCellEditorParams['allowDelete'] }
        if (duc.hasOwnProperty('allowUndo')) {
            let ducx = duc['allowUndo']
            if (! ducx.hasOwnProperty('update') ) {ducx['update'] = defaultCellEditorParams['allowDelete']['update'] }
            if (! ducx.hasOwnProperty('delete') ) {ducx['delete'] = defaultCellEditorParams['allowDelete']['delete'] }
        } else { duc['allowUndo'] = defaultCellEditorParams['allowUndo'] }
        //typechecks
        if (!du_defined) { grid.unshift(du_column) }
    }
    ValueTransform(grid_column, parameter_name) {
        /*
        Adds valueGetter, valueSetter, valueFormatter and toolTip. by default assumes is
        an expression. if Navtive is used i.e. valueGetterNative. the value is passed to 
        valueGetter with the native value.
        */
        let native_name = parameter_name +'Native'
        let globalx = this.globals
        if ( grid_column.hasOwnProperty(native_name) ) {
            grid_column[parameter_name] = grid_column[native_name]
        } else if (grid_column.hasOwnProperty(parameter_name) ) {
            let expr = grid_column[parameter_name]
            let options = this.OptionsParser(grid_column)
            grid_column[parameter_name] = ex.CreateAggridFunction(expr, globalx, options)
        } 
    }
    CellClassRules(grid_column) {
        /*
        Creates cellClassRules object for aggrid. if object is present and empty creates default
        object. otherwise each key value pair is processed. the value should be an expression syntax.
        The class names need to be available in assets/cell_survey.scss
        */
        if (grid_column.hasOwnProperty('cellClassRules') ) { 
            if (Object.keys(grid_column['cellClassRules']).length === 0) {
                let is_editable = false
                if (grid_column.hasOwnProperty('editable')) { is_editable = grid_column['editable'] }
                let validator_function = null
                if (grid_column.hasOwnProperty('validator')) { validator_function = grid_column['validator'] }
                cellClassRules.CellClassRulesInit( grid_column, is_editable, validator_function )
            }
            else {
                let keys = Object.keys(grid_column['cellClassRules'])
                let globalx = this.globals
                for (let i = 0; i< keys.length; i++) {
                    let expression_string = grid_column['cellClassRules'][keys[i]]
                    let fn = ex.CreateAggridFunction(expression_string, globalx, {} )
                    grid_column['cellClassRules'][keys[i]] = fn
                }
            }
        } else {
            let is_editable = false
            if (grid_column.hasOwnProperty('editable')) { is_editable = grid_column['editable'] }
            let validator_function = null
            if (grid_column.hasOwnProperty('validator')) { validator_function = grid_column['validator'] }
            cellClassRules.CellClassRulesInit( grid_column, is_editable, validator_function )
        }
    }
    /*
        for custom styles?
        cellStyle: params => {
            if (params.value === 'Police') {
                //mark police cells as red
                return {color: 'red', backgroundColor: 'green'};
                //default would be {color: '', backgroundColor: ''}
            }
            return null;
        }
    */

    DefaultValue(grid_column) {
        // if string or boolean or null?
        // need to make changes for linked object.
        if (! grid_column.hasOwnProperty('defaultValue') ) {return}
        let x = grid_column['defaultValue']
        if (type_check.IsNull(x) ) {
            grid_column['defaultValue'] = {'value': null, 'type': 'string'}
        }
        else if (type_check.IsBasicType(x)  ) {
            grid_column['defaultValue'] = {'value': String(x), 'type': 'string'}
        }
        else {
            grid_column['defaultValue'] = {'value': x, 'type': 'object'}
        }
    }
    DefaultOrderBy(grid_column, defaultOrderBy) {
        if (! grid_column.hasOwnProperty('defaultOrderBy') ) {return}
        let order_by = String(grid_column['defaultOrderBy']).toLowerCase()
        let field = grid_column['field']
        if (['asc','desc'].includes(order_by)) {
            defaultOrderBy.push({'field': field, 'order_by': order_by})
        } else { defaultOrderBy.push({'field': field, 'order_by': 'asc'}) }
    }
    DefaultFilter(grid_column, defaultFilter) {
        //appends default filter information.
        if (! grid_column.hasOwnProperty('defaultFilter') ) {return}
        let x = grid_column['defaultFilter']
        if (! x.hasOwnProperty['field'] ) { x['field'] = grid_column['field'] }

        defaultFilter.push(x)
    }
    DefaultParameters(grid_column) {
        /* Add default condtions to column */
        //editable and isCrud permissions
        if (grid_column.hasOwnProperty('editable')) {
            if (! grid_column.hasOwnProperty('isCrud')) {grid_column['isCrud'] = true}
            if (! grid_column.hasOwnProperty('isRequired')) { grid_column['isRequired']  = false }
            if (! grid_column.hasOwnProperty('ignoreError')) { grid_column['ignoreError'] = false }
            if (! grid_column.hasOwnProperty('allowNull')) { grid_column['allowNull'] = true }
        } else { 
            if (! grid_column.hasOwnProperty('isCrud')) {grid_column['isCrud'] = false} 
            if (! grid_column.hasOwnProperty('isRequired')) { grid_column['isRequired'] = false }
            if (! grid_column.hasOwnProperty('ignoreError')) { grid_column['ignoreError'] = false }
            if (! grid_column.hasOwnProperty('allowNull')) { grid_column['allowNull'] = true }
        }
        if (! grid_column.hasOwnProperty('dataType')) {grid_column['dataType'] = 'text'}
        if (! grid_column.hasOwnProperty('width'))   { grid_column['width'] = 500 }
        // ifNull: 'psql string calls to replace value'
        this.IfNull(grid_column)
    }
    HideColumns (grid_column) {
        if (grid_column.hasOwnProperty('hide') ) { return } 
        else { grid_column['hide'] = false }
    }
    IsEditable (grid_column) {
        //may have read write params that need to be processed in the future
        //if new row vs quried row. will decide from metadata?
        if (grid_column.hasOwnProperty('editable') ) { return } 
        else { grid_column['editable'] = false }
    }
    Validators(grid_column) {
        //creates validation function for aggrid cell
        let globalx = this.globals
        if (grid_column.hasOwnProperty('validator') ) {
            let expr = grid_column['validator']
            let options = this.OptionsParser(grid_column)
            grid_column['validator'] = ex.CreateAggridFunction(expr, globalx, options)
        }
    }
    MetaColumn( grid ) {
        /*Adds meta column to columnDefs. responsible for handling meta data and types like backups*/
        let meta_def_fns =   this.MetaColumnDefaultValues(grid)
        let fi = meta_def_fns['finsert']
        let fu = meta_def_fns['fundo']
        let fundo = meta_def_fns['fundo']

        let mx = {
            'field': meta_column_name,
            'editable': false,
            'hide': true,
            'suppressToolPanel': true,
            'initDefaultInsertRow': fi, //should be a function creates backups. and how row was added.
            'initUpdateRow': fu, //
            'undoRow': fundo,
            'showSort': false,
            'showFilter': false
        }
        //need overwrites for debugging
        grid.push(mx)
    }
    MetaColumnDefaultValues( grid ) {
        /*
        Creates object stored in meta_column. Stores backup and 

            // function (aggrid_params, backup_fields, crud_type) {
            //     //crud_type is insert or update 
            //  new rows default to insert. 
            // rows generated from query default to update. crud reroutes can be set in
            // pages config.
            // let backups = {'backups': {}, 'row_type': '' }
        */

        //is_crud
        //need to add column for delete
        let backups = this.CreateMetaBakupColumn(grid)
        let fupdate = this.InitDefaultUpdateRow(backups) //for rows created from querying the database
        let finsert = this.InitDefaultInsertRow(backups) //for newly added rows via add row or new_sheet
        let fundo   = this.UndoRow(backups) //function to reset row based on backup values
        let fdel    = this.DeleteRow()
        // let ferror  = this.RowHasError(grid,backups) //combines all validations functions
        // let fwarn   = this.RowHasWarning(grid,backups) //validations with ignored error
        // let fcomp   = this.RowIsComplete(grid) //all required fields and not empty
        // let fchange = this.RowIsChanged(grid)  //different from backup fields
        let grid_functions =  {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
            'fdel': fdel}//  , 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange, 'fwarn': fwarn }
        // let fsave_prep = this.RowIsReadyForSave(grid_functions)
        // grid_functions['fsave_prep'] = fsave_prep
        return grid_functions
    }
    //meta functions for creating and reseting rows
    CreateMetaBakupColumn( grid ) {
        //parse grid and creates backups object.
        let backups = {}
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            if (! grid_column.hasOwnProperty('isCrud') ) {continue}
            let field_name = grid_column['field']
            let default_value = null
            if (grid_column.hasOwnProperty('defaultValue')) {
                default_value = grid_column['defaultValue'].value || null
            }
            backups[field_name] = default_value
        }
        return backups
    }

    InitDefaultInsertRow(backups) {
        let fi = function () {
            let meta_column = { 'row_type': 'insert', 'meta_delete_undo_name': false }
            let field_names = Object.keys(backups)
            let meta_backup = {}
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                meta_backup[field_name] = backups[field_name]
            }
            meta_column['backups'] = meta_backup
            return meta_column
        }
        return fi
    }
    InitDefaultUpdateRow(backups) {
        let fu = function (row_data) {
            //row_data is whats stored in server object
            let meta_column = { 'row_type': 'update', 'meta_delete_undo_name': false }
            let field_names = Object.keys(backups)
            let meta_backup = {}
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                if (row_data.hasOwnProperty(field_name) ) { meta_backup[field_name] = row_data[field_name] }
                else { meta_backup[field_name] = null }
            }
            meta_column['backups'] = meta_backup
            return meta_column
        }
        return fu
    }
    UndoRow() {
        let fundo = function (row_data) {
            //undo row to initial state.
            if (! row_data.hasOwnProperty( meta_column_name )) {return}
            let meta_column = row_data[ meta_column_name]
            let meta_backup = meta_column[ 'backups' ]
            let field_names = Object.keys(meta_backup)
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                row_data[field_name] = meta_backup[field_name]
            }
            row_data[meta_delete_undo_name] = false
        }
        return fundo
    }
    DeleteRow() {
        let fdel = function (row_data) {
            //undo row to initial state.
            if (! row_data.hasOwnProperty( meta_delete_undo_name )) {return}
            row_data[meta_delete_undo_name] = true
        }
        return fdel

    }
    IsDeleted(row_data) {
        if (! row_data.hasOwnProperty( meta_delete_undo_name )) {return false}
        return row_data[meta_delete_undo_name] //should be boolean
    }
    //meta field meta field name meta fiel backup
    RowHasError (grid) {
        /*
        Checks if all editable fields are null
        Loops through columns in row whos keys are in the keys variable. If any value is an empty string
        returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.

        need to change empty paramters
        */

        // allowNull: true/false
        // isRequired: true/false


        let fvalids = [] //need to get validation functions.
        let allowNull = {}
        let isRequired = {}

        //ignoreError check if true. removes validation function from
        //ferror


        //true, false or null
        let ferror = function (params) {
            for (var i=0; i< fvalids.length; i++) {
                let fv = fvalids[i](params)
                is_valid = fv(params)
            }
            params.data[field_functions.is_error()] = is_error
            return is_error
        }
        return ferror
    }

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

            if (grid_column.hasOwnProperty('isCrud')) { isCrud = grid_column['isCrud'] }
            if (grid_column.hasOwnProperty('validator')) { hasValid = true }
            if (!isCrud || !hasValid) { continue }
            fields.push(field)
            if (grid_column.hasOwnProperty('isRequired'))  { isRequired[field]  = grid_column['isRequired'] }
            if (grid_column.hasOwnProperty('ignoreError')) { ignoreError[field] = grid_column['ignoreError'] }
            if (grid_column.hasOwnProperty('allowNull'))   { allowNull[field]   = grid_column['allowNull'] }
            if (grid_column.hasOwnProperty('validator'))   { 
                
                //error or warning
                allowNull   = grid_column['allowNull'] 
            
            }

            // if (grid_column.hasOwnProperty('validator')) {}
        }

    }

    RowHasWarning (grid) {
        /*
        Checks if all editable fields are null
        Loops through columns in row whos keys are in the keys variable. If any value is an empty string
        returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.

        need to change empty paramters
        */

        // allowNull: true/false
        // isRequired: true/false

        let fvalids = [] //need to get validation functions.
        let allowNull = {}
        let isRequired = {}

        //ignoreError check if true. removes validation function from
        //ferror


        //true, false or null
        //loop through fields?
        let ferror = function (params) {
            for (var i=0; i< fvalids.length; i++) {
                let fv = fvalids[i](params)
                is_valid = fv(params)
            }
            params.data[field_functions.is_error()] = is_error
            return is_error
        }
        return ferror
    }


    RowIsComplete (grid, backups) { 
        //Determines if cell value is Null. If any value is empty its false
        let fcomp = function(params) {
            for (var i=0; i< server_fields.length; i++) {
                var value = params.data[server_fields[i]]
                if (value === null) {
                    params.data[field_functions.is_complete()] = false
                    return
                }
            }
            params.data[field_functions.is_complete()] = true
        }
        return fcomp

    }

    //parameters for row
    RowIsChanged (grid, backups) {
        //Determines if cell value is Null. If any value is empty its false
        // console.log(server_fields)
        let fchange = function(params) {
            for (var i=0; i< server_fields.length; i++) {
                var value = params.data[server_fields[i]]
                var backup_value = params.data[ field_functions.BackupFieldName(server_fields[i]) ]
                if (value !== backup_value ) {
                    params.data[field_functions.is_changed()] = true
                    return
                }
            }
            params.data[field_functions.is_changed()] = false
            return

        }
        return fchange

    }
    
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
    }

    async CellEditorParams(grid_column) {
        /*
        Handles specialized modules. i.e. autocomplete and aggrid rich cell editor

        Adds valueGetter and valueSetter inorder to handle data processing.

        Pull Data if needed on init?

        */
        if (! grid_column.hasOwnProperty('cellEditor')) {return}
        let cedit = grid_column['cellEditor']
        //check cell editor type?
        if (cedit === 'agRichSelectCellEditor' ) {}
        else if (cedit === 'subGrid' ) {} //has placeholder for modal?
        else if (cedit === 'dateSelector' ) {}
        else if (cedit === 'autoComplete' ) {}

    }
    OptionsParser(grid_column) {
        //aditional options present in 
        let options = {}
        if (grid_column.hasOwnProperty('dataType')) {
            let dx = grid_column['dataType'].toLowerCase()
            if (dx.includes('big')) { options['mathjs_type_set'] = 'big' }
        }
        return options
    }
    IfNull(grid_column) {
        //verify valid if null replacement value
        if (! grid_column.hasOwnProperty('ifNull') ) { grid_column['ifNull'] = 'null' }
        let default_values = [
            /*
            These are default values that can be direclty entered into crud operations. These
            */
            'default', 'current_timestamp', 'current_time','null',
            'current_date', 'localtime', 'localtimestamp', ""
        ]
        let if_null = grid_column['ifNull']
        if (! default_values.includes(if_null) ) { grid_column['ifNull'] = 'null' }
    }
    AddValueSetter(grid_column) {
        /*
        Adds value setter to numbers and date. If not correct format return null

        */

        if (grid_column.hasOwnProperty('valueSetter')) {return}
        let field = grid_column['field']

        let number_types = ['smallint', 'integer', 'int', 'bigint', 'decimal', 'numeric',
        'real', 'double precision', 'money', 'numeric', 'float']

        if (number_types.includes(grid_column['dataType'])) {

            let fn = function (params) {
                if (! type_check.IsNumber(params.newValue) ) {
                    params.data[field] = null
                    return true
                }
                else {
                    params.data[field] = params.newValue
                    return true
                }
            }
            grid_column['valueSetter'] = fn
            return
        }

        let date_types = ['date', 'timestamp', 'time']
        if (date_types.includes(grid_column['dataType'])) {
            let fn = function (params) {
                if (! type_check.IsDate(params.newValue) ) {
                    params.data[field] = null
                    return true
                }
                else {
                    params.data[field] = params.newValue
                    return true
                }
            }
            grid_column['valueSetter'] = fn
            return
        }
    }
    AddValueGetter(grid_column) {
        //mainly for autocomplete and AgGridRichSelector. used for returning 
        //key value.

    }

}

//submodal function initializer

function SubModalInit() {
    //loads class creates object returns values?
}

module.exports = {'ColumnDefsInit': ColumnDefsInit}