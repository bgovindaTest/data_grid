/*
Appends function to class rules if empty for each row

editable_pass_style
editable_error_style
non_editable_pass_style
non_editable_error_style

class styles are stored in ./assets/cell_survey.scss

need to add pass is null or true
*/

const type_check = require('../../../TypeCheck')

function CellClassRulesInit( grid_column) {
    /*
        Assembles cellClassRules based on if is_editable is a function or boolean and
        if validatorFunction is defined
    */
    let is_editable = grid_column['editable']
    let validator_function = grid_column['validator'] || null
    if (grid_column.hasOwnProperty('cellClassRules')) { return }

    cellClassRules = {}
    if (type_check.IsNull(validator_function) || type_check.IsUndefined(validator_function) ) {
        //no validation function
        if (type_check.IsFunction(is_editable)) { 
            cellClassRules['editable_pass_style'] = params => is_editable(params)
            cellClassRules['non_editable_pass_style'] = params => !is_editable(params) 
        }
        else if (type_check.IsBoolean(is_editable)) {
            if (is_editable) {
                cellClassRules['editable_pass_style'] = params => true
            }
            else { 
                cellClassRules['non_editable_pass_style'] = params => true 
            }
        }
    } 
    
    
    else {

        cellClassRules['editable_pass_style']       = EditablePassStyle(is_editable, validator_function)
        cellClassRules['editable_error_style']      = EditableErrorStyle(is_editable, validator_function)
        cellClassRules['non_editable_pass_style']   = NonEditablePassStyle(is_editable, validator_function)
        cellClassRules['non_editable_error_style']  = NonEditableErrorStyle(is_editable, validator_function)
    }
    grid_column['cellClassRules'] = cellClassRules
}

function EditablePassStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return is_editable(params) && ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) { return is_editable && ValidatorPass(vf(params) ) }
    }

}
function EditableErrorStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return is_editable(params) && ! ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) { return is_editable && ! ValidatorPass(vf(params) ) }
    }
}
function NonEditablePassStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return !is_editable(params) && ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) { return !is_editable && ValidatorPass(vf(params) ) }
    }
}
function NonEditableErrorStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) {  return !is_editable(params) && ! ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) {  return !is_editable && ! ValidatorPass(vf(params) ) }
    }
}

function ValidatorPass(val) {
    /*
    Returns true if validation function passes i.e. returns true
    or does not run returns null. Null should be returned if missing
    required fields to run.
    */
    if (val === true || val === null || typeof val === 'undefined') {return true}
    return false
} 


module.exports = CellClassRulesInit