/*
gridParams functions is used as a global object to control the state and other general information for the grid. The
gridParams is initialzied during the main_page.vue initialization. autcomplete_maps is created in  

Important Stuff:
get_route_params = CreateGetRouteParams(queryParams)
NextPage( get_route_params['pagination'] )

input_params

InitalizeRowDataFieldsDefinitions

gridParams: {
    autocomplete_map: is an object of objects that contains map information for each autocomplete function. created in grid_rules.js
        autcomplete_map[field_name] = {'selectValues': [{}], 'mapFunction': {key} -> select_value_row, 'key': 'map_function_key', 'crud_value', 'crud_value'  }
    field_variables: this object is contained 
    user_permissions: {
        //boolean arguments determine behavior and functionality of grid.
        allow_read: boolean
        allow_insert: boolean
        allow_update: boolean
        allow_deactivate: boolean
        allow_delete: boolean
        is_admin: boolean
        is_assigned: boolean
    },
    page_status: {
        //initialized by main_page.vue. values are updated by different components throughout the app. The parameters
        //below are used to inform the app of the current state of the system.
        is_loading:
        is_init:
        is_save:
        is_crud_error:
        is_error:
        error_msg:
        route_loading_status: {
            //tables being loaded?     Current loading status?
        }
    },

    //Crud Parameters
    //need to save how to process new pull data for get routes.
    //Get Route Parameters

    new_input_params: {}

    query_routes: {route_name} -> {row will need input params for it. If it came from the server. } //this provides teh required input
        for converting the pull down rows from the grid to blah?

    get_route_params: {
        'current_get_route': "" 
        'where':
        'rules':
        'pagination':
        'order_by':
    }
    save_route_path: path url to the save route.
}

//Need to intialize user_permissions first.
Define parameters and where they are created?
Used in places to add or make changes to grid_params object.
In order to make sure things to get over written?
Where initializations take place
what goes into input params?
User Permissions?

*/
function PermsPass(user_permissions, perms_level) {
    if (user_permissions['permission_level'] >= perms_level ) {return true}
    return false 
}

//Used to determine if should be allowed to edit a field?
function CanRead(user_permissions,perms_level = -1000) { return (user_permissions['allow_read'] && PermsPass(user_permissions, perms_level) )||user_permissions['is_admin']}
function CanInsert(user_permissions,perms_level = 0) { return (user_permissions['allow_insert'] && PermsPass(user_permissions, perms_level) ) || user_permissions['is_admin']}
function CanUpdate(user_permissions,perms_level = 0) { return (user_permissions['allow_update'] && PermsPass(user_permissions, perms_level) )|| user_permissions['is_admin']}
function CanDelete(user_permissions,perms_level = 0) { return (user_permissions['allow_delete'] && PermsPass(user_permissions, perms_level) )|| user_permissions['is_admin']}
function CanDeactivate(user_permissions,perms_level = 0) { return (user_permissions['allow_deactivate'] && PermsPass(user_permissions, perms_level) ) || user_permissions['is_admin']}
function CanModify(user_permissions,perms_level = 0) { return CanInsert(user_permissions,perms_level) || CanUpdate(user_permissions,perms_level) || CanDelete(user_permissions,perms_level) }
function IsAdmin(user_permissions) { return user_permissions['is_admin'] }
function IsAssigned(user_permissions) { return user_permissions['is_assigned'] } //has specialty permissions attached to user

module.exports = {
    'CanRead': CanRead,
    'CanInsert': CanInsert,
    'CanUpdate': CanUpdate,
    'CanDelete': CanDelete,
    'CanDeactivate': CanDeactivate,
    'CanModify': CanModify,
    'IsAdmin': IsAdmin,
    'IsAssigned': IsAssigned
}