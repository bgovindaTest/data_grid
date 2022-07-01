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
        'headerParams': {
            links: [{'name': xxx, 'url': xxx }],
            help: "",
            addRow: true
        }
        'crudParams': //i.e. new row, update, delete, etc read/etc create default objects for query params?
            { 
                default: ->
                select:  ->
                insert:  -> //string or {'route': 'string', 'doInstead': 'update', 'crudParams': {}}
                update:  ->
                delete:  ->
                upsert_set: [] //for upsert only sent in set object in payload
                set_filter: [] //for update will just filter things out from data object
                default_fields: {}
                on_constraint: ''
                on_conflict: ''
                deleteWarning: ''
            }

        'columnDef': //agrid info
        },
        {'name': 'y'
        'crudParams': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
    ]


gridOptions.suppressPropertyNamesCheck = true

validator: function()

alias: {'pull': 'push'} //defaults to field

//remove valueSetter if readonly?

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
requiredFieldsTypeCheck: true //unchangeage
nullReplace: true
 
isCrud:   true/false maybe read/write/? r rw w converted to object
editable: true/false {'update': true/false, 'insert': true/false}
deleteWarning: string (determines if delete should happen)
isFlag: for submit buttons or other functionality not meant to be sent to server.
    data is editable but doesnt get sent to the server. flags do allow the 
    row to be registered as a change.

dataType:  //used for sorting? need to add time and datetime filters

allowNull: true/false
isRequired: true/false
ignoreError: true/false (for calculated fields?) allow to pass or skip?
typeCheckError? if true dont remove invalid data type.
    //show as error instead?. dont run validation if error. not implemented yet would
    //also have to add for xyz

//returnOnIgnoreError: true/false if true use default otherwise

ifNull: 'psql string calls to replace value'
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""

//need to add parameters to defaultValue and defaultFilter to deal with sub modal cases
//field determines which data to get from params.data in aggrid. key is if its an object.
defaultValue: {'value': 'string', 'type': '', 'key': '', 'field': '' } handle raw value or replacement from row params?
defaultOrderby: 'asc/desc' (done by column order in columnDefs)
defaultFitler: string value

showFilter: default true (if false cant be changed) should hide from filter module
showSort: default true (if false cant be used for sorting)

Responsible for creating valueGetter, valueSetter and valueFormatter
default is expression syntax string.
if object options are {'string': string_value}, {'function': js_function} {'expression': expression string}

NativeFields: fields are not parsed. taken as is and passed to aggrid directly
    i.e. valueGetter = valueGetterNative
    valueGetterNative: 
    valueSetterNative: (optional) (grid_rules_object). Need to add for date column?
    valueFormatterNative: blah
    toolTipNative: expression for variables

hide - hides the field
suppressToolPanel - removes it from the tool panel.

pageParams (rowPrams: for subgrid)\
    row_params: (available for subgrid )
    globals:
    url_params:

primaryKey: 'default id'
*/
const ex = require('./ExpressionParser')
const cellClassRules = require('./ColumnDefs/CellClassRules')
const type_check = require('../TypeCheck')

const lodashCloneDeep = require('lodash.clonedeep')

const meta_column_name = '_ag-meta_'
const meta_delete_undo_name = '_ag-meta-delete-undo_'


//has whole grid object. Any data loading comes from
//grid_funcs. Vue Components can also have async await
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

    RunSubGridInit(grid, rowParams) {
        //add rowParams?

        //Copy grid
        //Add default values from rowData
        //this.RunGridInit()
        //return
    }
    RunMainGridInit() {
        //grid_name or position
        //this.RunGridInit()
        //returns gridConfiguration
    }
    RunGridInit() {
        //for MainGrid
        //make copy?
        //grid = JSON.parse(JSON.stringify(food)) for deep copy
        let grid = lodashCloneDeep(this.grid) //messes up column order probably?
        let defaultOrderBy  = []  //name value?
        let defaultFilter  = [] //name operator value
        let enforcedFilter = []

        //prepend delete_undo column
        InitializeDeleteUndoColumn(grid)
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            if (grid_column['field'] === meta_delete_undo_name ) { continue }
            //CrudParams
            //NavBar
            //if supplied by config
            this.ValueTransform(grid_column, 'valueGetter')
            this.ValueTransform(grid_column, 'valueSetter')
            this.ValueTransform(grid_column, 'valueFormatter')
            this.ValueTransform(grid_column, 'toolTip')
            //add default value setters and getters
            this.IfNull(grid_column)
            this.IsEditable(grid_column)
            this.HideColumns(grid_column)
            this.Validators(grid_column)
            this.CellClassRules(grid_column)
            this.CellEditorParams(grid_column)
            this.DefaultOrderBy(grid_column,defaultOrderBy)
            this.DefaultFilter(grid_column,defaultFilter, enforcedFilter)
            this.DefaultValue(grid_column)
            this.DefaultParameters(grid_column)
            this.CellWidth(grid_column)
            this.AddValueSetter(grid_column)
            this.HeaderName(grid_column)
        }
        this.MetaColumn(grid)
        let fns = this.MetaAuxillaryFunction( grid )
        //filterParams
        //SortByParams
        //HeaderParams
        return {'grid': grid, 'defaultSortBy': defaultSortBy, 'defaultFilter': defaultFilter,
            'enforcedFilter': enforcedFilter}
    }

    HeaderName(grid_column) {
        if (! grid_column.hasOwnProperty('headerName')) {
            grid_column['headerName'] = grid_column['field']
        }

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
    DefaultFilter(grid_column, defaultFilter, enforcedFilter) {
        //appends default filter information.
        let is_filter   = grid_column.hasOwnProperty('defaultFilter')
        let show_filter = grid_column['showFilter'] || false
        if (! is_filter ) {return}
        if (show_filter) {
            let x = grid_column['defaultFilter']
            if (! x.hasOwnProperty['field'] ) { x['field'] = grid_column['field'] }
            defaultFilter.push(x)
        } else {
            let x = grid_column['defaultFilter']
            if (! x.hasOwnProperty['field'] ) { x['field'] = grid_column['field'] }
            enforcedFilter.push(x)
        }



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
    IsCurdParameters(grid_column) {

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
    //begin meta functions
    MetaColumn( grid ) {
        /*Adds meta column to columnDefs. responsible for handling meta data and types like backups*/
        let mx = {
            'field': meta_column_name,
            'editable': false,
            'hide': true,
            'suppressToolPanel': true,
            'showSort': false,
            'showFilter': false
        }
        //need overwrites for debugging
        grid.push(mx)
    }

    MetaAuxillaryFunction( grid ) {
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
        let backups = this.CreateMetaBackupColumn(grid)
        let fupdate = null
        let finsert = null
        let fundo   = null
        let fdel    = null
        let ferror  = null
        let fwarn   = null
        let fcomp   = null
        let fchange = null
        let grid_functions =  {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
            'fdel': fdel, 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange, 'fwarn': fwarn }
        let fis_save = null
        grid_functions['fis_save'] = fis_save
        grid_functions['deleteWarning'] = ""
        if (grid.hasOwnProperty('deleteWarning') ) {
            //displays on save to warn of possible rejected deletes
            grid_functions['deleteWarning'] = grid['deleteWarning']
        }
        return grid_functions
    }

    //meta functions for creating and reseting rows
    CreateMetaBackupColumn( grid ) {
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
        // if (options.hasOwnProperty['requiredFields'] ) { requiredFields = options['requiredFields'] }
        let options = {}
        if (grid_column.hasOwnProperty('dataType')) {
            let dx = grid_column['dataType'].toLowerCase()
            if (dx.includes('big')) { options['mathjs_type_set'] = 'big' }
        }
        if (grid_column.hasOwnProperty('requiredFields')) { options['requiredFields'] = grid_column['requiredFields'] }

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

        //numbers
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
        //dates and types. Date transform
        let date_types = ['date', 'timestamp', 'time']
        if (date_types.includes(grid_column['dataType'])) {
            let fn = function (params) {
                if (! type_check.IsDate(params.newValue) ) {
                    params.data[field] = null
                    return true
                }
                else {
                    //type cast?
                    params.data[field] = params.newValue
                    return true
                }
            }
            grid_column['valueSetter'] = fn
            return
        }
        //autocomplete and agrichselector
    }

    HeaderParams(grid) {
        let headerParams  = {}
        headerParams['new_sheet'] = false
        headerParams['add_row']   = true
        headerParams['save']   = true
    }

    OrderByParams(grid) {
        //current and changed

    }

    FilterParams(grid) {
        //current and changed

    }

}

module.exports = {'ColumnDefsInit': ColumnDefsInit}