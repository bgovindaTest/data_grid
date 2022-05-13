/*
Used for initializing and updating information for the loading and saving modal windows.

LoadingModalParamsInitialization
SavingModalParamsInitialization

LoadingModalParamsReset
SavingModalParamsRest

*/
function SavingModalParamsInitialization() {
    var savingModalParams = {}
    SavingModalParamsReset(savingModalParams)
    return savingModalParams
}


function LoadingModalParamsInitialization() {
    var loadingModalParams = {}
    LoadingModalParamsReset(loadingModalParams)
    return loadingModalParams
}

function SavingModalParamsReset(params) {
    /*
    This is the vue script for the popup window that is displayed to prevent a user from
    editing/adding to multiple components.

    'is_saving': true used to lock the modal. When saving is done switching to false will display a final message. init value is true
    'is_started': false used to display a value checking display. Should be false until right before sending the first batch of data. 
    When is_started === true. The modal will display information on the status of the saving.
    'total_rows_to_save':  -1,
    'total_blocking_rows': -1,
    'rows_sent_to_server': 0,
    'row_start': 0,
    'row_end': 0,
    'is_save_error': false,
    'save_error_msg': "raw html",
    'insert_count': 0,
    'update_count': 0,
    'delete_count': 0,
    'upsert_count': 0,

    'error_count': 0

    Order is_saving = true is_started = false
    check initial save conditions. If no blocking rows and rows to save change is_started to true and leave is_save to true. Otherewise switch is_saving to false
    and close modal. -1 is the initial values. message only displays when values are zero or greater than zero which are set in crud_functions.

    if is_started = true and is_saving = true
    updated row counts and error counts as saving is sending results. 

    When all is done switch is_saving to false. A final message will display and the modal can close.
    The rowData and columnDefs will be altered based on the the final state. If nothing happens rowData and columnDefs is unchanged.

    If all rowData is saved without error. rowData is cleared and the modal can be closed.
    Otherwise the app is switched to an error state. The last column will display an error message. And the rows will
    show the error message as the last column.

    The navbar options will hide everything except reset which will allow the user to clear the rowData, reset the navbar and the
    error state.

    May run this funciton on close in modal window for save to clear everything?
    */
    params['is_saving'] = false //to lock modal
    params['is_started'] = false 
    params['total_rows_to_save'] = -1
    params['total_blocking_rows'] = -1
    params['rows_sent_to_server'] = 0
    params['row_start'] = 0
    params['row_end'] = 0
    params['is_save_error'] = false
    params['save_error_msg'] = ""
    params['insert_count'] = 0
    params['update_count'] = 0
    params['delete_count'] = 0
    params['upsert_count'] = 0
    params['error_count'] = 0

}


function LoadingModalParamsReset(params) {
    /*
    'is_loading': this is used to lock the modal window. Set to false when close should be allowed. Generally will self hide if no errors
    'offset': display the beginning of row range being loaded
    'limit': display the ending of the row range being loaded
    'route_name': 'default' the name of the query_type
    'is_load_error': boolean. if server error. Need to dislpay
    'load_error_msg': raw html message to display if error occurs
    'is_end': should set to true when no more rows to load or if an error occurs. Prevent running another data pull
    'init_query_no_rows_pulled': set to true with is_end also set to true. This says that no rows were pulled on run query at the beginning.
    user needs to change query parameters.
    'is_init': boolean flag set to true when RunQuery is ran. Used to inform that a query has been started.

    Next page should be blocked by is_init until Run Query has set it to true.
    */

    params['is_loading'] = false
    params['offset'] = 0
    params['limit'] = 1000
    params['route_name'] = 'default'
    params['is_load_error'] = false
    params['load_error_msg'] = ""
    params['is_end'] = false
    params['init_query_no_rows_pulled'] = false //set true if no rows found on initial query
    params['is_init'] = false 
}

module.exports = {
    "SavingModalParamsInitialization": SavingModalParamsInitialization,
    "LoadingModalParamsInitialization": LoadingModalParamsInitialization,
    "SavingModalParamsReset": SavingModalParamsReset,
    "LoadingModalParamsReset": LoadingModalParamsReset
}