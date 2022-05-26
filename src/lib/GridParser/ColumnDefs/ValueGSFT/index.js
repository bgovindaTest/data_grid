/*
Parses grids json object and converts expression syntax into javascript functions. 

Responsible for creating valueGetter, valueSetter and valueFormatter
NativeFields: fields are not parsed. taken as is and passed to aggrid directly
    i.e. valueGetter = valueGetterNative
    valueGetterNative: 
    valueSetterNative: (optional) (grid_rules_object). Need to add for date column?
    valueFormatterNative: blah
    toolTipNative: expression for variables
*/
const ex = require('../../ExpressionParser')

class ValueGSFT {
    constructor(grids, globals) {
        //grid is json object for aggrid
        this.grids = grids
        this.grid  = null
        this.globals = globals

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
            let grid_row = this.grid[i]
            this.ValueTransform(grid_row, 'valueGetter')
            this.ValueTransform(grid_row, 'valueSetter')
            this.ValueTransform(grid_row, 'valueFormatter')
            this.ValueTransform(grid_row, 'toolTip')
        }

    }
    ValueTransform(grid_row, parameter_name) {
        let native_name = parameter_name +'Native'
        let globalx = this.globals
        if (grid_row.hasOwnProperty(parameter_name) ) {
            let expr = grid_row[parameter_name]
            let options = this.OptionsParser(grid_row)
            grid_row[parameter_name] = ex.CreateAggridFunction(expr, globalx, options)
        } else if ( grid_row.hasOwnProperty(native_name) ) {
            grid_row[parameter_name] = grid_row[native_name]
        }
    }
    OptionsParser(grid_row) {
        let options = {}
        if (grid_row.hasOwnProperty['data_type']) {
            let dx = grid_row['data_type'].toLowerCase()
            if (dx.includes('big')) { options['mathjs_type_set'] = 'big' }
        }
        return options
    }

}

module.exports = {'ValueGSFT': ValueGSFT}