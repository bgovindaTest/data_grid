//IsEdtiable???
//Default Editable??
//PassUserInfo?? if_admin?
//

/*
Used to determine if a column is editable


*/

//default hide columns
//make all fields editable or create another column

function EditInit(grid_column_rule, gridParams, columnDef) {
    /*
    Will generally need user permissions for this.
    editableFunction in the grid_rules array should have the form
    function (input_params) {
        //initialize paramters for return function
        return function (params) {
            //use paramters from input_params
            //make some calculations
            //set value in error column
            //return true if error and false otherwise.
        }
    }
    */
    if (!grid_column_rule.hasOwnProperty('editable')) {return}
    var editableObject = grid_column_rule['editable']
    if (IsPrimitiveType(editableObject) ) {
        columnDef['editable'] = editableObject
        return
    }
    if (!grid_column_rule['editable'].hasOwnProperty('input_params') ) {
        console.log(grid_column_rule)
        throw new Error("Missing input params")

        // grid_column_rule['editable']['input_params'] = {}
    }
    var input_params = grid_column_rule['editable']['input_params']
    ProcessInputParams( input_params, grid_column_rule, gridParams )
    var fnx = grid_column_rule['editable']['function']
    columnDef['editable'] = fnx(input_params)  
}

function CanInsert(params, user_permissions,perms_level=0) { //for new rows?
    if (params.data[is_new_row] && params.data[allow_update] ) {
        if (gpf.CanInsert(user_permissions,perms_level)) {return true}
        else {return false}
    } else {
        return false
    }
}

function CanUpdate(params, user_permissions,perms_level=0) { //for pulled rows
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



module.exports = {

}