/*
This module controls the cell style for ag-grid. When a user enters new data into a column/row its corresponding cell style
function is fired. The functions below output an css object that defines the state of the cell. If the data entered is valid
no css change occurs. If there is an error the function will return the error css style, otherwise it will return the normal
css for the grid.

colors
https://www.ag-grid.com/vue-data-grid/expressions-and-context/

*/
const field_functions = require('@/library/app_functions/field_functions')
const editable = require('@/library/cell_functions/editable')

var errVar = {'border-color': 'red', 'border-width':'medium', 'background-color': ""}
var passVar = {'border-color': '', 'border-width': 'thin', 'background-color': ""}
var warningVar = {'border-color': 'orange', 'border-width':'medium', 'background-color': ""}

var computedErrVar = {'border-color': 'red', 'border-width':'medium', 'background-color': 'rgba(189, 195, 199, 0.3)'}
var computedPassVar = {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}
var computedWarningVar = {'border-color': 'orange', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}

var deletedStyle = {'border-color': '', 'border-width': 'thin', 'background-color': 'rgba(46, 49, 49, 0.5)'}

//extract is deleted variable name from grid_rules?
// var __is_deleted__ = '__is_deleted__'
var __is_deleted__ = field_functions.is_deleted()
const is_new_row   = field_functions.is_new_row()
const allow_update = field_functions.allow_update()

function TestEditStyle(params) {
    if (params.data[__is_deleted__]) {
        return deletedStyle
    } else {
        return passVar
    }
} 

function TestComputedStyle(params) {
    if (params.data[__is_deleted__]) {
        return deletedStyle
    } else {
        return computedPassVar
    }
} 


function EditableStyle(params,validation_column, user_permissions, insert_perms_level=0, update_perms_level=0) {
    //need to switch to validation column?
    //if validation_column !== ""
    if (params.data[__is_deleted__] === true) { return deletedStyle }
    if (editable.CanModify(params, user_permissions,insert_perms_level, update_perms_level)  ) {
        if (validation_column === "") {return passVar}
        if (! params.data.hasOwnProperty(validation_column)) {return passVar}
        if (! params.data[validation_column]  ){ return errVar} 
        else { return passVar}
    } else {
        if (validation_column === "") {return computedPassVar}
        if (! params.data.hasOwnProperty(validation_column)) {return computedPassVar}
        if (! params.data[validation_column] ){ return computedErrVar} 
        else { return computedPassVar}
    } 
}


function EditableStyleInputParams(input_params) {
    return function (params) {
        if (input_params.hasOwnProperty('insert_permission_level') && input_params.hasOwnProperty('update_permission_level')) {
            return EditableStyle(params, input_params['validation_field'], input_params['user_permissions'],input_params['insert_permission_level'],input_params['update_permission_level'] )
        } else if (input_params.hasOwnProperty('insert_permission_level') ) {
            return EditableStyle(params, input_params['validation_field'], input_params['user_permissions'],input_params['insert_permission_level'], 0)
        } else if (input_params.hasOwnProperty('update_permission_level') ) {
            return EditableStyle(params, input_params['validation_field'], input_params['user_permissions'],0 ,input_params['update_permission_level'] )
        } 
        else {
            return EditableStyle(params, input_params['validation_field'], input_params['user_permissions'])
        }
    }
}


function InsertAndIfAdminCanUpdateEditableStyle(params,validation_column, user_permissions) {
    //need to switch to validation column?
    //if validation_column !== ""
    if (params.data[__is_deleted__] === true) { return deletedStyle }
    if (editable.CanInsertAndIfAdminCanUpdate(params, user_permissions)  ) {
        if (validation_column === "") {return passVar}
        if (! params.data.hasOwnProperty(validation_column)) {return passVar}
        if (! params.data[validation_column]  ){ return errVar} 
        else { return passVar}
    } else {
        if (validation_column === "") {return computedPassVar}
        if (! params.data.hasOwnProperty(validation_column)) {return computedPassVar}
        if (! params.data[validation_column] ){ return computedErrVar} 
        else { return computedPassVar}
    } 
}


function InsertAndIfAdminCanUpdateEditableStyleInputParams(input_params) {
    return function (params) {
        return InsertAndIfAdminCanUpdateEditableStyle(params, input_params['validation_field'], input_params['user_permissions'])
    } 
}


function DeactivateEditableStyle(params,validation_column, user_permissions, perms_level=0) {
    //need to switch to validation column?
    //if validation_column !== ""
    if (params.data[__is_deleted__] === true) { return deletedStyle }
    if (editable.CanDeactivate(params, user_permissions,perms_level)  ) {
        if (validation_column === "") {return passVar}
        if (! params.data.hasOwnProperty(validation_column)) {return passVar}
        if (! params.data[validation_column]  ){ return errVar} 
        else { return passVar}
    } else {
        if (validation_column === "") {return computedPassVar}
        if (! params.data.hasOwnProperty(validation_column)) {return computedPassVar}
        if (! params.data[validation_column] ){ return computedErrVar} 
        else { return computedPassVar}
    } 
}


function DeactivateEditableStyleInputParams(input_params) {
    return function (params) {
        if (input_params.hasOwnProperty('deactivate_permission_level') ) {
            return DeactivateEditableStyle(params, input_params['validation_field'], input_params['user_permissions'],input_params['deactivate_permission_level'])

        } else {
            return DeactivateEditableStyle(params, input_params['validation_field'], input_params['user_permissions'])
        }

    } 
}





function NonEditableStyle(params,validation_column) {
    //used for functions that should not be edited.
    if (params.data[__is_deleted__] === true) { return deletedStyle }
    if (validation_column === "") {return computedPassVar}
    if (! params.data.hasOwnProperty(validation_column)) {return computedPassVar}
    if (! params.data[validation_column] ){ return computedErrVar} 
    else { return computedPassVar}
}


function NonEditableStyleInputParams(input_params) {
    return function (params) {
        return NonEditableStyle(params, input_params['validation_field'])
    } 
}

//LawsonFteStyle

function LawsonCfteStyle(params) {
    //used for functions that should not be edited.
    if (params.data[__is_deleted__] === true) { return deletedStyle }
    var dx = params.data
    var lawsonFTE      = dx['lawson_fte']
    var academic       = dx['academic']
    var contract    = dx['contract']
    var va             = dx['veterans_affairs']
    var administration = dx['administration']
    if (lawsonFTE === null || academic === null || contract === null 
        || va === null || administration === null) { return computedPassVar }
    var total = academic + contract + va + administration
    var cFTE = lawsonFTE - total
    // params.data['cfte'] = cFTE
    if (cFTE >= 0 && cFTE <= 1) {
        return computedPassVar
    } else { return computedErrVar }
}





//custom function for appointments and lcgs. warning message vs error
function AutocompleteIsActiveEditableStyle(params,validation_column, active_column, user_permissions) {
    //need to switch to validation column?
    //if validation_column !== ""
    if (params.data[__is_deleted__] === true) { return deletedStyle }
    if (editable.CanModify(params, user_permissions)  ) {
        if (validation_column === "") {return passVar}
        if (! params.data.hasOwnProperty(validation_column)) {return passVar}
        if (!params.data[validation_column]){ return errVar}
        if (!params.data[active_column] ){ return warningVar }
        else { return passVar}
    } else {
        if (validation_column === "") {return computedPassVar}
        if (! params.data.hasOwnProperty(validation_column)) {return computedPassVar}
        if (! params.data[validation_column] ){ return computedErrVar}
        if (!params.data[active_column] ){ return computedWarningVar }
        else { return computedPassVar}
    } 
}


function AutocompleteIsActiveEditableStyleInputParams(input_params) {
    return function (params) {
        return AutocompleteIsActiveEditableStyle(params, input_params['validation_field'], input_params['is_active_column'], input_params['user_permissions'])
    } 
}

function ComputedStyle (params) {
    return computedPassVar
}



module.exports = {
    'TestComputedStyle': TestComputedStyle,
    'TestEditStyle': TestEditStyle,
    'EditableStyleInputParams': EditableStyleInputParams,
    'NonEditableStyleInputParams': NonEditableStyleInputParams,
    'AutocompleteIsActiveEditableStyleInputParams': AutocompleteIsActiveEditableStyleInputParams,
    'ComputedStyle': ComputedStyle,
    'LawsonCfteStyle': LawsonCfteStyle,
    'DeactivateEditableStyleInputParams': DeactivateEditableStyleInputParams,
    'InsertAndIfAdminCanUpdateEditableStyleInputParams': InsertAndIfAdminCanUpdateEditableStyleInputParams,
    //style variables
    'errVar':  errVar,
    'passVar': passVar,
    'warningVar': warningVar,
    'computedErrVar': computedErrVar,
    'computedPassVar': computedPassVar,
    'computedWarningVar': computedWarningVar,
    'deletedStyle': deletedStyle
}
