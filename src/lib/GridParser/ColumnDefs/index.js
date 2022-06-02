/*
Parses grids json object and converts expression syntax into javascript functions. 

gridOptions.suppressPropertyNamesCheck = true

validator: function()
 
isCrud:   true/false
editable: true/false {'update_only': true/false, 'insert_only': true/false}


dataType:  //used for sorting? need to add time and datetime filters

allowNull: true/false
isRequired: true/false
ignoreError: true/false (for calculated fields?)


ifNull: 'psql string calls to replace value'
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""

defaultValue: {'value': 'string', 'type': '', 'key': '' } handle raw value or replacement from row params?
defaultOrderby: 'asc/desc' (done by column order in columnDefs)
defaultFitler: {'value': 'string/bool/', 'type': ''} type is 'raw'
    from: {'field'}

showFilter: default true (if false cant be changed) should hide from filter module

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
staticDropDown: [{}]

subgrid params (valid names and default)
*/
const ex = require('../../ExpressionParser')
const type_check = require('../../../TypeCheck')
const cellClassRules = require('../CellClassRules')
const lodashClonedeep = require('lodash.clonedeep')
const meta_column_name = '_ag-meta_'

//import axios
//create configurations.

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
        //make copy?
        //grid = JSON.parse(JSON.stringify(food)) for deep copy
        let grid = lodashCloneDeep(this.grid) //messes up column order probably?
        let defaultOrderBy  = []  //name value?
        let defaultFilter  = [] //name operator value

        //prepend delete_undo column
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
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
        }
        this.MetaColumn(grid)
        return {'grid': grid, 'defaultSortBy': defaultSortBy, 'defaultFilter': defaultFilter}
    }
    ValueTransform(grid_column, parameter_name) {
        /*
        Adds valueGetter, valueSetter, valueFormatter and toolTip. by default assumes is
        an expression. if Navtive is used i.e. valueGetterNative. the value is passed to 
        valueGetter with the native value.
        */
        let native_name = parameter_name +'Native'
        let globalx = this.globals
        if (grid_column.hasOwnProperty(parameter_name) ) {
            let expr = grid_column[parameter_name]
            let options = this.OptionsParser(grid_column)
            grid_column[parameter_name] = ex.CreateAggridFunction(expr, globalx, options)
        } else if ( grid_column.hasOwnProperty(native_name) ) {
            grid_column[parameter_name] = grid_column[native_name]
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
                let is_editable = grid_column['editable']
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
        } else { return }
    }

    DefaultValue(grid_column) {
        // if string or boolean or null?
        // need to make changes for linked object.
        if (! grid_column.hasOwnProperty['defaultValue']) {return}
        let x = grid_column['defaultValue']
        if (type_check.IsNull(x) ) {
            grid_column['defaultValue'] = {'value': null, 'type': 'string', 'key': '' }
        }
        else if (type_check.IsBasicType(x)  ) {
            grid_column['defaultValue'] = {'value': String(x), 'type': 'string', 'key': '' }
        }
    }

    DefaultOrderBy(grid_column, defaultOrderBy) {
        if (! grid_column.hasOwnProperty['defaultOrderBy']) {return}
        let order_by = grid_column['defaultOrderBy']
        let field = grid_column['field']
        if (! ['asc','desc'].includes(order_by)) {
            defaultOrderBy.push({'field': field, 'order_by': order_by})
        } else { defaultOrderBy.push({'field': field, 'order_by': 'asc'}) }
    }
    DefaultFilter(grid_column, defaultFilter) {
        if (! grid_column.hasOwnProperty['defaultFilter']) {return}
        defaultFitler.push(defaultFilter)
    }

    DefaultParameters(grid_column) {
        /* Add default condtions to column */
        if (! grid_column.hasOwnProperty['editable']) {return}

        if (! grid_column.hasOwnProperty['isCrud']) {return}

        if (! grid_column.hasOwnProperty['isRequired']) {return}
        if (! grid_column.hasOwnProperty['dataType']) {return}

        if (! grid_column.hasOwnProperty['width']) {return}

        if (! grid_column.hasOwnProperty['dataType']) {return}

        if (! grid_column.hasOwnProperty['editable']) {return}
        if (! grid_column.hasOwnProperty['isRequired']) {return}
        if (! grid_column.hasOwnProperty['dataType']) {return}


        if (! grid_column.hasOwnProperty['ifNull']) {return}

        if (! grid_column.hasOwnProperty['hide']) {return}
        // ifNull: 'psql string calls to replace value'
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

        let meta_def_fns =   this.MetaColumnDefaultValues()
        let fi = meta_def_fns['fi']
        let fu = meta_def_fns['fu']

        let mx = {
            'field': meta_column_name,
            'editable': false,
            'hide': true,
            'suppressToolPanel': true,
            'defaultInsertValue': fi, //should be a function creates backups. and how row was added.
            'defaultUpdateValue': fu //
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

        let backups = {}
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            if (! grid_column.hasOwnProperty['isCrud'] ) {continue}
            let field_name = grid_column['field']
            let default_value = grid_column['defaultValue'].value
            backups[field_name] = default_value
        }

        //for rows created from querying the database
        let fu = function (row_data) {
            //row_data is whats stored in server object
            let meta_column = { 'row_type': 'update', 'is_deleted': false }
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
        //for newly added rows via add row or new_sheet
        let fi = function () {
            let meta_column = { 'row_type': 'insert', 'is_deleted': false }
            let field_names = Object.keys(backups)
            let meta_backup = {}
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                meta_backup[field_name] = backups[field_name]
            }
            meta_column['backups'] = meta_backup
            return meta_column
        }
        return {'fi': fi, 'fu': fu}
    }

    async CellEditorParams(grid_column) {
        /*
        Handles specialized modules. i.e. autocomplete and aggrid rich cell editor

        Adds valueGetter and valueSetter inorder to handle data processing.

        Pull Data if needed on init?

        */
        if (! grid_column.hasOwnProperty['cellEditor']) {return}
        let cedit = grid_column['cellEditor']
        //check cell editor type?
        if (cedit === 'agRichSelectCellEditor' ) {}

        else if (cedit === 'subGrid' ) {} //has placeholder for modal?
        else if (cedit === 'deleteUndo' ) {} //rules for delete/undo?
        else if (cedit === 'dateSelector' ) {}
        else if (cedit === 'autoComplete' ) {}

    }

    OptionsParser(grid_column) {
        //aditional options present in 
        let options = {}
        if (grid_column.hasOwnProperty['dataType']) {
            let dx = grid_column['dataType'].toLowerCase()
            if (dx.includes('big')) { options['mathjs_type_set'] = 'big' }
        }
        return options
    }
    IfNull(grid_column) {
        //verify valid if null replacement value
        if (grid_column.hasOwnProperty['ifNull'] ) { return }
        let default_values = [
            /*
            These are default values that can be direclty entered into crud operations. These
            */
            'default', 'current_timestamp', 'current_time','null',
            'current_date', 'localtime', 'localtimestamp', ""
        ]
        let if_null = grid_column['ifNull']
        if (! default_values.includes(if_null) ) { grid_column['ifNull'] = 'default' }
    }

}


module.exports = {'ColumnDefsInit': ColumnDefsInit}