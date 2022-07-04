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

function CellClassRulesInit( grid_column, is_editable, validator_function ) {

    cellClassRules = {}
    if (type_check.IsNull(validator_function)) {
        if (type_check.IsFunction(is_editable)) { 
            cellClassRules['editable_pass_style'] = params => is_editable(params)
            cellClassRules['non_editable_pass_style'] = params => !is_editable(params) 
        }
        else if (type_check.IsBoolean(is_editable)) {cellClassRules['editable_pass_style'] = params => true}
        else { cellClassRules['non_editable_pass_style'] = params => true }
    } else {
        cellClassRules['editable_pass_style'] = EditablePassStyle(is_editable, validator_function)
        cellClassRules['editable_error_style'] = EditableErrorStyle(is_editable, validator_function)
        cellClassRules['non_editable_pass_style'] = NonEditablePassStyle(is_editable, validator_function)
        cellClassRules['non_editable_error_style'] = NonEditableErrorStyle(is_editable, validator_function)
    }
    grid_column['cellClassRules'] = cellClassRules
}

function EditablePassStyle(is_editable, validator_function) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return is_editable(params) && validator_function(params) }
    }
    else {
        return function (params) { return is_editable && validator_function(params) }
    }

}
function EditableErrorStyle(is_editable, validator_function) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return is_editable(params) && !validator_function(params) }
    }
    else {
        return function (params) { return is_editable && !validator_function(params) }
    }
}
function NonEditablePassStyle(is_editable, validator_function) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return !is_editable(params) && validator_function(params) }
    }
    else {
        return function (params) { return !is_editable && validator_function(params) }
    }
}
function NonEditableErrorStyle(is_editable, validator_function) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) {  return !is_editable(params) && !validator_function(params) }
    }
    else {
        return function (params) {  return !is_editable && !validator_function(params) }
    }
}

function ValidatorFunctionPass(val) {
    /*
    Returns true if validation function passes i.e. returns true
    or does not run returns null. Null should be returned if missing
    required fields to run.
    */

    if (val === true || val === null) {return true}
    return false
} 


module.exports = {'CellClassRulesInit': CellClassRulesInit}