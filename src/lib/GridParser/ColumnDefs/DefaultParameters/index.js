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
    '__is_test__': 




gridOptions.suppressPropertyNamesCheck = true

validator: function()

alias: {'pull': 'push'} //defaults to field

//remove valueSetter if readonly?

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
requiredFieldsTypeCheck: true //unchangeage 

ifNull: 'psql string calls to replace value'
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""

    //if actual value?
    {'value': 'xyz', 'cmd': postgres_command}

defaultValue: {'value': 'string', 'type': '', 'key': '', 'field': '', ifNullSet: true/false }
defaultOrderby: 'asc/desc' (done by column order in columnDefs)
defaultFitler: string value

showFilter: default true (if false cant be changed) should hide from filter module
showSort: default true (if false cant be used for sorting)


hide - hides the field
suppressToolPanel - removes it from the tool panel.

*/

const type_check = require('../TypeCheck')
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
    SubGridInit() {
        //grid_name or position
        //this.RunGridInit()
        //returns gridConfiguration
    }
    GridInit() {
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

            this.IfNull(grid_column)
            this.IsEditable(grid_column)
            this.HideColumns(grid_column)
            this.DefaultOrderBy(grid_column,defaultOrderBy)
            this.DefaultFilter(grid_column,defaultFilter, enforcedFilter)
            this.DefaultValue(grid_column)
            this.DefaultParameters(grid_column)
            this.CellWidth(grid_column)
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
    //defaulValueIfNull



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
}

// SubGridRowDataDefaults(grid, grid_column, rowData) {
//     /*
//     Converts everyting to uniform object inorder to set static fields.

//     //returns a function

//     Adds vales from row to create submodal grid.
//     rowDataDefaults = {
//         'defaultFilter': {} key value? fro row params
//         'defaultSort': []
//         'enforcedFilters': {}
//         'defaultValue':  {}
//     }

//     */
//     return

// }
// }

// function AutoCompleteMapper( ) {

// }

// function DropDownMapper( ) {

// }









module.exports = {'ColumnDefsInit': ColumnDefsInit}