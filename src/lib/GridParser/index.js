/*
Parses grids json object and converts expression syntax into javascript functions. 

    'qparams_prefix':"",
    'url_prefix':"",
    '__init_params__':  {},
    '__url_params__': {},
    '__drop_downs__': {},
    '__valuesObject__': [{}] //array is grid position object key is field and value is values to be passed.
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

    //In Query Params
    // DefaultOrderBy(grid_column, defaultOrderBy) {
    //     if (! grid_column.hasOwnProperty('defaultOrderBy') ) {return}
    //     let order_by = String(grid_column['defaultOrderBy']).toLowerCase()
    //     let field = grid_column['field']
    //     if (['asc','desc'].includes(order_by)) {
    //         defaultOrderBy.push({'field': field, 'order_by': order_by})
    //     } else { defaultOrderBy.push({'field': field, 'order_by': 'asc'}) }
    // }
    // DefaultFilter(grid_column, defaultFilter, enforcedFilter) {
    //     //appends default filter information.
    //     let is_filter   = grid_column.hasOwnProperty('defaultFilter')
    //     let show_filter = grid_column['showFilter'] || false
    //     if (! is_filter ) {return}
    //     if (show_filter) {
    //         let x = grid_column['defaultFilter']
    //         if (! x.hasOwnProperty['field'] ) { x['field'] = grid_column['field'] }
    //         defaultFilter.push(x)
    //     } else {
    //         let x = grid_column['defaultFilter']
    //         if (! x.hasOwnProperty['field'] ) { x['field'] = grid_column['field'] }
    //         enforcedFilter.push(x)
    //     }

    // }




    HeaderParams(grid) {
        let headerParams  = {}
        headerParams['new_sheet'] = false
        headerParams['add_row']   = true
        headerParams['save']   = true
    }



}

module.exports = {'ColumnDefsInit': ColumnDefsInit}