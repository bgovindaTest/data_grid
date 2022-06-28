/*
How to handle required fields and type checks

Need error checking.

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
requiredFieldsTypeCheck: true //unchangeage
nullReplace: true


*/
const data_types = require ('../../DataConfig')
const type_check = require('../../TypeCheck')
let null_dtype_to_value = data_types['null_dtype_to_value']

function HasRequiredFields(rowData, requiredFields) {
    for (let i =0; i < requiredFields.length; i++) {
        let rf = requiredFields[i]
        if (! rowData.hasOwnProperty(rf)) {return false}
        if (type_check.IsNull(rowData[rf])) {return false}
    }
    return true
}

function NullValue(cell_value, data_type) {
    //if null replaces with value for calculaiton i.e. 0 for numbers
    //and empty string for text
    if (type_check.IsNull(cell_value)) {
        return null_dtype_to_value[data_type] || null
    }
    return cell_value
}

function GridColumnRequiredFields(grid_column) {
    let tmp = []
    if (grid_column.hasOwnProperty('requiredFields')) {
        let rf = grid_column['requiredFields']
        if (! type_check.IsArray(rf)) {
            grid_column['requiredFields'] = []
        } else {
            for(let i =0; i < rf.length; i++) {
                tmp.push(rf[i])
            }
        }
    }
    if (! grid_column.hasOwnProperty('validatorRequiredFields')) {
        grid_column['validatorRequiredFields'] = []
    } else {
        if (! type_check.IsArray(grid_column['validatorRequiredFields'])) {
            grid_column['validatorRequiredFields'] = []
        }
    }
    if ( ! grid_column.hasOwnProperty('valueGetterRequiredFields') ) {
        grid_column['valueGetterRequiredFields'] = []
    } else {
        if (! type_check.IsArray(grid_column['validatorRequiredFields'])) {
            grid_column['validatorRequiredFields']
        }
    }

}