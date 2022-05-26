/*
//Value Setter Helper, selectData and AutocompleteParams are required for the autocomplete functionality

ValueSetterHelper modifies the return object from autocomplete into the form required for ag-grid. 
autocomplete returns an object containing a value where as ag-grid requires a primitive type i.e. 
string, interger, float.




wrapped in function?
valueSetter: function (input_params) {
    //initalize the following from input_params. column_name, map_function, return_value, key_value, backup_key_value, map_backup_field
    //send initialize parameters to ValueGetterAndSetMap or some other function
    return function (params) {
        return ValueGetterAndSetterMap(params, column_name, map_function, return_value, key_value, backup_key_value, map_backup_field)
    }
The function is called in @/library/init_functions/function_init.js

Responsible for creating valueGetter, valueSetter and valueFormatter

*/
const ex = require('../../ExpressionParser')
CreateAggridFunction( expr, globals, options )


class ValueGSFT {
    constructor(grid, globals) {
        //grid is json object for aggrid
        this.grid = grid
        this.globals = globals

    }
    RunInit() {}
    ValueSetterInit(grid_row){}
    ValueGetterInit(grid_row){}
    ValueFormatterInit(grid_row){}
    ToolTipInit(grid_row){}

}





module.exports = {}