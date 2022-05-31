/*
Parses grids json object and converts expression syntax into javascript functions. 

gridOptions.suppressPropertyNamesCheck = true

allowNull: true/false

validator: function()
isCrud: true/false  serverValid: appends if allow null permissions?
isRequired: true/false

dataType:  //used for sorting? need to add time and datetime filters


defaultValue: handle raw value or replacement from row params?
defaultSortby: [1.'asc'] or
defaultFitler: (value) 

Responsible for creating valueGetter, valueSetter and valueFormatter
NativeFields: fields are not parsed. taken as is and passed to aggrid directly
    i.e. valueGetter = valueGetterNative
    valueGetterNative: 
    valueSetterNative: (optional) (grid_rules_object). Need to add for date column?
    valueFormatterNative: blah
    toolTipNative: expression for variables

var columnDefs = [
    {
       headerName: "Stone_ID",
       field: "Stone_ID",
       width: 100,
       hide: true,
       suppressToolPanel: true
    }
]

hide - hides the field
suppressToolPanel - removes it from the tool panel.

pageParams (rowPrams: for subgrid)\
    globals:
    url_params:
    row_params: (available for subgrid )

subgrid params (valid names and default)
*/
const ex = require('../../ExpressionParser')
const cellClassRules = require('../CellClassRules')

class ColumnDefsInit {
    //for main loader
    //grid is json object for aggrid
    constructor(grid, pageParams, rowParams) {
        this.grid  = grid
        this.globals   = pageParams.globals || {}
        this.dropDowns = pageParams.dropDowns || {}
        this.urlParams = pageParams.urlParams || {}
        this.rowParams = rowParams
    }

    RunGridInit() {
        //make copy?
        //grid = JSON.parse(JSON.stringify(food)) for deep copy
        let grid = JSON.parse(JSON.stringify(this.grid))
        let defaultSortBy  = []  //name value?
        let defaultFilter  = {} //name operator value
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            this.ValueTransform(grid_column, 'valueGetter')
            this.ValueTransform(grid_column, 'valueSetter')
            this.ValueTransform(grid_column, 'valueFormatter')
            this.ValueTransform(grid_column, 'toolTip')
            this.IsEditable(grid_column)
            this.Validators(grid_column)
            this.CellClassRules(grid_column)
            this.CellEditorParams(grid_column)
            //determine if defaultValue or should replaceWithRowParam
        }
        defaultSortBy = this.ProcessSortBy(defaultSortBy)
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

    HideColumns (grid_column) {
        if (grid_column.hasOwnProperty('hide') ) { return } 
        else { grid_column['hide'] = false }
    }

    IsEditable (grid_column) {
        //may have read write params that need to be processed in the future
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
    //overwrite if rowParams or urlParams available?
    DefaultValues() {}
    DefaultSort() {}
    DefaultOrderBy() {}

    CellEditorParams() {
        //how to handle subgrid?
        //data types
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
}

module.exports = {'ColumnDefsInit': ColumnDefsInit}