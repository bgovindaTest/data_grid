<script>

function LoadAndSaveModalWindowParameters(modalParams,params) {
    //help_active is help window displayed. select_column is select column module in where module active
    modalParams['save_modal'] = modal_functions.SavingModalParamsInitialization()
    modalParams['load_modal'] = modal_functions.LoadingModalParamsInitialization()
    if (params.hasOwnProperty('default_query_route')) {
        modalParams['load_modal']['route_name'] = params['default_query_route']
    }

}

function CreateQueryTypeModalParameters(modalParams,params, query_routes) {

    var queryTypeParams = {'route_name': ""}
    if (params.hasOwnProperty('default_query_route')) {
        queryTypeParams['route_name'] = params['default_query_route']
    }
    if (Object.keys(query_routes).length > 0 && queryTypeParams['route_name'] === "") {
        //take first name from route_names
        var route_name = Object.keys(query_routes)[0]
        queryTypeParams['route_name'] = route_name
    }
    //Assemble save_type_description
    for (let key in query_routes) {
        var query_params = query_routes[key]
        var input_params = query_params['input_params']
        if (input_params['__save_route__'] === 'insert') {
            query_params['save_description'] ="Add New Row: Changes to data pulled using this route will be treated as a new entry. A new row will be added to the database on save."
            query_params['save_description'] += " If they row already exists the entry will be rejected. You will need to use an update route type in order to change"
            query_params['save_description'] +="an existing row."
        } else if (input_params['__save_route__'] === 'update') {
            query_params['save_description'] ="Update Existing Row: Changes to data pulled using this route will attempt to modify the existing row in the databse."
        } else if (input_params['__save_route__'] === 'upsert') {
            query_params['save_description'] ="Create Row or overwrite exiting row. Changes to data pulled using this route will be treated as a new entry. A new row will be added to the database on save."
            query_params['save_description'] += " If they row already exists the entry will attempt to overwrite it."
        } else {
            query_params['save_description'] ="Unique operation contact admin for details"
        }
    }

    modalParams['querytype_modal'] = queryTypeParams

}

</script>
