//IsEdtiable???
//Default Editable??
//PassUserInfo?? if_admin?
//

/*
Used to determine if a column is editable


*/

const gpf = require('@/library/app_functions/grid_param_functions')
const field_functions = require('@/library/app_functions/field_functions')

const is_new_row   = field_functions.is_new_row()
const allow_update = field_functions.allow_update()

function CanInsert(params, user_permissions,perms_level=0) {
    if (params.data[is_new_row] && params.data[allow_update] ) {
        if (gpf.CanInsert(user_permissions,perms_level)) {return true}
        else {return false}
    } else {
        return false
    }
}

function CanUpdate(params, user_permissions,perms_level=0) {
    if (!params.data[is_new_row] && params.data[allow_update] ) {
        if (gpf.CanUpdate(user_permissions,perms_level)) {return true}
        else {return false}
    } else {
        return false
    }
}

function CanModify(params, user_permissions,insert_perms_level=0, update_perms_level=0) {
    return CanInsert(params, user_permissions,insert_perms_level) || CanUpdate(params, user_permissions,update_perms_level)
}

function CanModifyInputParams(input_params) {
    return function (params) {
        if (input_params.hasOwnProperty('insert_permission_level') && input_params.hasOwnProperty('update_permission_level')) {
            return CanModify(params,input_params['user_permissions'],input_params['insert_permission_level'],input_params['update_permission_level'] )
        } else if (input_params.hasOwnProperty('insert_permission_level') ) {
            return CanModify(params,input_params['user_permissions'],input_params['insert_permission_level'], 0)
        } else if (input_params.hasOwnProperty('update_permission_level') ) {
            return CanModify(params,input_params['user_permissions'],0 ,input_params['update_permission_level'] )
        } 
        else {
            return CanModify(params,input_params['user_permissions'])
        }
    }
}

function CanInsertAndIfAdminCanUpdate(params, user_permissions) {
    if (CanInsert(params, user_permissions)) {return true}
    else if (CanUpdate(params, user_permissions)) {
        if ( gpf.IsAdmin(user_permissions) ) {return true}
        else {return false}
    }
    else {return false}

}

function CanInsertAndIfAdminCanUpdateInputParams(input_params) {
    return function (params) {
        return CanInsertAndIfAdminCanUpdate(params,input_params['user_permissions'])
    }
}

function CanDeactivate(params, user_permissions, perms_level=0) {
    if (params.data[is_new_row]) {return true}
    else {
        if (gpf.CanDeactivate(user_permissions,perms_level) ) {return true}
        else {return false}
    }
}

function CanDeactivateInputParams(input_params) {
    return function (params) {
        if (input_params.hasOwnProperty('deactivate_permission_level') ) {
            return CanModify(params,input_params['user_permissions'],input_params['deactivate_permission_level'] )
        } else {
            return CanDeactivate(params, input_params['user_permissions'])
        }
    }
}

module.exports = {
    'CanInsert': CanInsert,
    'CanUpdate': CanUpdate,
    'CanModify': CanModify,
    'CanModifyInputParams': CanModifyInputParams,
    'CanDeactivate': CanDeactivate,
    'CanDeactivateInputParams': CanDeactivateInputParams,
    'CanInsertAndIfAdminCanUpdate': CanInsertAndIfAdminCanUpdate,
    'CanInsertAndIfAdminCanUpdateInputParams': CanInsertAndIfAdminCanUpdateInputParams
}