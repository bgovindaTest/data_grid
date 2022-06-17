/*
Valid cell editors and processing?

needs to match AggridRichSelector

Handles dropdowns and xyz

valueSetter not needed for AggridRichSelector or Autocomplete

grid_init.js is the main module to initialize the app.
grid_column_rules Input Parameters: These also go in the grid_column_rules. It used to set the how user enters data. Two options are below.

2.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.
    selectValues: [{}] is a json array containing the data shown in the drop down and used in the autocomplete
    return_value: this is value displayed in the cell. Its also used as the key for the mapfunction i.e.
        mapfunction[key] -> id (or some other value). This process is completed during the save function route that sends
        the cell data to the database. This is often the id for the value to be stored in postgres.

    column_info (columnDef): json array. Has the header value which must match a value in the selectValues array.
        init_width is the width to used for the autocomplete table.

    crud_value: column_name value to send to the server. Often the return value and crud_value are different for example npi maybe stored in the
        cell for the users convience, but the postgres id for that row is sent to the database. 

    The crud_value, return_value and selectValues object are used to create the mapFunction which takes the return_value and uses its as a key
        against select values to return the crud_value. both the return_value and the crud_value should return unique values.

    lookupAlias: alias for mapping lookup values to whats in ui
    selectAlias: alias for mapping ui values to whats in table?
    key:
    ui_key:
    server_key:
    filters:
    orderBy:
    isDropDown: (i.e. only single value or lookup)

    map_params: This is a json object that is sent with the axios call with the map route. It can contain additional parameters for making data pull
        from server.


    cellEditorFramework: 'AutocompleteAg'
    cellEditorParams: {
        selectValues: selectValues,
        return_value: 'appointment_code', (return_value is used as the key for all maps using this column)
        column_info: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        map_params: {} 
        crud_value: id
        api_route: ()
        api_type: (get/post)
        real_time: false //if intial pull or needs consistent refresh
        api_name: if drop down loaded initialy?
        map_function: //the map function is place here during initializations
}




*/

/*
This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: 
    cellEditorFramework: "autoComplete"
    cellEditorParams: {
        rowDataValues: selectValues, for drop down?
        return_value: 'appointment_code', (return_value is used as key)
        column_info: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        map_route: string
        map_params: {} 
        crud_value: 'id'
        return_field: ""
        view_aliases: {}
        lookup_aliases: {}
    }

    //make object by default. 

    cellEditor: "autoComplete",
The cellEditorFramework must be equal to 'AutocompleteAg' This tells the grid which input format to use.
selectValues: is the array that contains all the data and return values for the autocomplete column and related calculated fields. The data can be 
    initialized in each ./pages/xxx.vue if no map_route is defined i.e. !grid_row_rule.hasOwnProperty('map_route') this will be left unchanged. 
    Otherwise this will be overwritten by data from the server.
return_value: this is a name of a unique column in selectValues. This is whats returned by the autocomplete. Its also used as the key
    in the created maping function that allows calculated columns to generate values based on the return value inputed in a cell
api_route: this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
    to extract the selectValues array. 
    use post or get route?
crud_value:


axios return object
{ 'error_msg': err_msg, 'is_error': true, 'rows': [], 'table_name': table_name, 'route_name': route_name }

Returns:
autocomplete_map[field] -> {'selectValues': [{}], 'mapFunction': map_function, 'key': return_value, 'crud_value', crud_value }

gridWidth + 'px'
*/


// cellEditor: 'agRichSelectCellEditor',
// allowNull
// cellEditorParams: {
//     values: ['Male', 'Female'],
//     key is first?
//     cellEditorPopup: true,
//   },
// },

class CustomEditor {
    //for main loader
    //grid is json object for aggrid
    constructor(grid_column) {
        this.grid_column  = grid_column
    }   
}


/*
BooleanSelector.vue

Cell Editor Params for AgRichSe
'agRichSelectCellEditor'

*/
// let x = {
//     cellEditorParams: {
//         values: ['English', 'Spanish', 'French', 'Portuguese', '(other)'],
//         formatValue: function () {},
//         is_object: false



//     },
// }

// function CreateCellParams() {}