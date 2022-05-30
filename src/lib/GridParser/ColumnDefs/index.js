/*
Parses grids json object and converts expression syntax into javascript functions. 

gridOptions.suppressPropertyNamesCheck = true

allowNull: true/false
defaultValue: 
validator: function()
isCrud: true/false  serverValid: appends if allow null permissions?
isRequired: true/false

dataType:  //used for sorting? need to add time and datetime filters

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

*/
const ex = require('../../ExpressionParser')
const type_check = require('../../TypeCheck')
const cellClassRules = require('../CellClassRules')

class ColumnDefsInit {
    constructor(grids, pageParams) {
        //grid is json object for aggrid
        this.grids = grids
        this.grid  = null
        this.globals = pageParams.globals || {}

    }
    RunGridsInit() {
        let grid_keys = Object.keys(this.grids)
        for( let i = 0; i < grid_keys.length; i+= 1) {
            let grid_key = grid_keys[i]
            this.grid = this.grids[ grid_key]
            this.RunGridInit()
        }
    }

    RunGridInit() {
        for(let i=0; i < this.grid.length; i++) {
            let grid_column = this.grid[i]
            this.ValueTransform(grid_column, 'valueGetter')
            this.ValueTransform(grid_column, 'valueSetter')
            this.ValueTransform(grid_column, 'valueFormatter')
            this.ValueTransform(grid_column, 'toolTip')
            this.IsEditable(grid_column)
            this.Validators(grid_column)
            this.CellClassRules(grid_column)
        }

    }
    ValueTransform(grid_column, parameter_name) {
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
        if (grid_column.hasOwnProperty('cellClassRules') ) { 
            if (Object.keys('cellClassRules').length === 0) {
                let is_editable = grid_column['editable']
                let validator_function = null
                if (grid_column.hasOwnProperty('validator')) { validator_function = grid_column['validator'] }
                cellClassRules.CellClassRulesInit( grid_column, is_editable, validator_function )
            
            }
        } else { return }
    }

    HideColumns (grid_column) {
        if (grid_column.hasOwnProperty('editable') ) { return } 
        else { return }
    }

    IsEditable (grid_column) {
        if (grid_column.hasOwnProperty('editable') ) { return } 
        else { return }

    }

    Validators(grid_column) {
        let globalx = this.globals
        if (grid_column.hasOwnProperty(this.validator) ) {
            let expr = grid_column[this.is_valid]
            let options = this.OptionsParser(grid_column)
            grid_column[this.is_valid] = ex.CreateAggridFunction(expr, globalx, options)
        }
    }


    OptionsParser(grid_column) {
        let options = {}
        if (grid_column.hasOwnProperty['dataType']) {
            let dx = grid_column['dataType'].toLowerCase()
            if (dx.includes('big')) { options['mathjs_type_set'] = 'big' }
        }
        return options
    }

}


module.exports = {'ColumnDefsInit': ColumnDefsInit}