/*
valueFormatter functions

used to change how data is displayed to user.
*/

const moment = require('moment')

function ValueDateTimeFormatter (params) {

    if (params.value === null) {return params.value}
    let dateAsString = params.value
    dateAsString = moment(moment( dateAsString))
    if (! dateAsString.isValid() ) {return null}

    dateAsString = dateAsString.format('MM/DD/YYYY HH:mm:ss')
    return dateAsString

}

function ValueNumberFormatter (params) {

    if (params.value === null) {return ""}
    return String(params.value)

}

function ValueFormatterInit(grid_column_rule, gridParams, columnDef) {
    /*
    value_setter functions in the grid_rules array should have the form
    function (input_params) {
        //initialize paramters for return function
        return function (params) {
            //use paramters from input_params
            //make some calculations
            //return final value
        }
    }
    */
   if (!grid_column_rule.hasOwnProperty('valueFormatter')) {return}
   var valueSetterObject = grid_column_rule['valueFormatter']
   if (IsPrimitiveType(valueSetterObject) ) {
       columnDef['valueFormatter'] = valueSetterObject
       return
   }
   if (!grid_column_rule['valueFormatter'].hasOwnProperty('input_params') ) {
        console.log(grid_column_rule)
        throw new Error("Missing input params")
    //    grid_column_rule['valueFormatter']['input_params'] = {}
   }
   var input_params = grid_column_rule['valueFormatter']['input_params']
   ProcessInputParams( input_params, grid_column_rule, gridParams )
   var fnx = grid_column_rule['valueFormatter']['function']
   columnDef['valueFormatter'] = fnx(input_params)
}


module.exports = {
    'ValueDateTimeFormatter': ValueDateTimeFormatter,
    'ValueNumberFormatter': ValueNumberFormatter
}