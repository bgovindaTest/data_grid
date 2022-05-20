/*
This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name
    cellEditorFramework: 'AutocompleteAg'
    cellEditorParams: {
        selectValues: selectValues,
        return_value: 'appointment_code', (return_value is used as key)
        column_info: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        match_string: (string) default __match_string__
        match_string_function: function?
        map_route: string
        map_params: {} 
        crud_value: 'id'
        map_function: //the map function is place here during initialization
        return_field: ""
    }
The cellEditorFramework must be equal to 'AutocompleteAg' This tells the grid which input format to use.
selectValues: is the array that contains all the data and return values for the autocomplete column and related calculated fields. The data can be 
    initialized in each ./pages/xxx.vue if no map_route is defined i.e. !grid_row_rule.hasOwnProperty('map_route') this will be left unchanged. 
    Otherwise this will be overwritten by data from the server.
return_value: this is a name of a unique column in selectValues. This is whats returned by the autocomplete. Its also used as the key
    in the created maping function that allows calculated columns to generate values based on the return value inputed in a cell
match_string: the name appended to selectValues and search by the autocomplete widget. the input is searched against this column.
    in general its a concatenation of all the columns
map_string_function: a function provided in the form function (select_value_row) { //concatenate columns return select_value_row[map_string_name]}
    this function allows for custom function to create match string. Otherwise all columns are concatenated together and spacing is removed.
map_route: this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
    to extract the selectValues array. 
map_params: this is an object. If provided can send paramters along with the map_route to determine how to filter out the map_route.
crud_value: 
map_function:
return_field: this is the name of the column that the data will be saved to. Its used when the name of the column being pulled is different then the
    save column. For example, classification_name i.e. App or Physician is the value displayed and used for the autocomplete, however in the providers
    table the value is stored as classification_id. So in this example field would be classification_name and return_field would be classification_id

Inputs:
grid_column_rules: Array of grid_column_rule
autocomplete_map: this object is sent from the main_page.vue it will store all the autocomplete information used by AutocompleteAg and corresponding
    calculated functions
axios_object: This is the axios module. Its passed from the main_page.vue. This allows for cals to be made to the server.
grid_params: This contains additional information and functions for initializing the data grid. Here it will be used to send data to the user
    to update on the status of loading data. If and error occurs this module throws and error.

axios return object
{ 'error_msg': err_msg, 'is_error': true, 'rows': [], 'table_name': table_name, 'route_name': route_name }

Returns:
autocomplete_map[field] -> {'selectValues': [{}], 'mapFunction': map_function, 'key': return_value, 'crud_value', crud_value }

*/

//takes axios object, variable_name and route. return
const field_functions = require('@/library/app_functions/field_functions')

async function InitializeAutocompleteMaps(grid_column_rules, autocomplete_map, axios_object, grid_params) {
    //Main Function. Inititalizes the autocomplete_map object with data required for the aucotomplete
    //functionality
    // ConsoleLog()
    for (let i = 0; i < grid_column_rules.length; i++) {
        var grid_column_rule = grid_column_rules[i]
        if (! IsAutocompleteColumn(grid_column_rule) ) {continue}
        await AddAutoCompleteObject(grid_column_rule, autocomplete_map, axios_object, grid_params)
    }
    grid_params['autocomplete_map'] = autocomplete_map
}

function ConsoleLog() {
    console.log('hi from autocomplete')
    field_functions.CLOG()
}

async function AddAutoCompleteObject(grid_column_rule, autocomplete_map, axios_object, grid_params) {
    await ExtractSelectValues(grid_column_rule, axios_object, grid_params)
    AddSearchStringColumn(grid_column_rule)
    CreateMapFunction(grid_column_rule)
    AppendToAutcompleteMapObject(grid_column_rule, autocomplete_map) 
}

async function ExtractSelectValues(grid_column_rule, axios_object, grid_params) {
    /*
    This is the main function to pull data from the server and insert it into selectValues. selectValues can be hard coded, if 
    map_route is not in the grid_column_rule object the hard coded selectValues will be used. Otherwise it will be replaced with
    data from the server. grid_params is updated here to track the current status of loading preliminary data from server. If 
    error occurs it should be passed to grid_params and this program should terminate.

    Need to handle post and pulling data by using crud_functions modules.
    Need to update grid_params using grid_functions module.

    This funtions is used to pull the select values for autocomplete_init.js
    Error should buble up to main_page.vue. This is because any errors loading the select values will effect the
    whole app and the user should not be able to continue

    Below is the format for the retured object from the server.
    { 'error_msg': err_msg, 'is_error': true, 'rows': [], 'table_name': table_name, 'route_name': route_name }

    */

    if (!grid_column_rule.hasOwnProperty('cellEditorParams') ) { console.log("Mising cellEditorParams")}
    if (grid_column_rule['cellEditorParams'].hasOwnProperty('map_route') ) {
        var map_route = grid_column_rule['cellEditorParams']['map_route']
        var map_params = {}
        if (grid_column_rule['cellEditorParams'].hasOwnProperty('map_params') ) {map_params = grid_column_rule['cellEditorParams']['map_params'] }
        // console.log(map_route)
        // {'user_id': 1}
        // var mapData = await axios_object.post(map_route, {'user_id': 1})
        var mapData = await axios_object.post(map_route, map_params)
        //need to parse mapData for row info
        //check for error
        grid_column_rule['cellEditorParams']['selectValues'] = mapData.data['map_rows']
        //run axios route. Use external function to update grid_params.
        //replace selectValues in grid_column_rule
    } else if (grid_column_rule['cellEditorParams'].hasOwnProperty('selectValues') ) {
 
    } else {
        console.log("Missing select values from autocomplete")
        if (!grid_column_rule['cellEditorParams'].hasOwnProperty('selectValues') ) {
            grid_column_rule['cellEditorParams']['selectValues']  = []
        }

    }
}

function AddSearchStringColumn(grid_column_rule) {
    /*
    This is used to create the search string used in the autocomplete widget. The default value used in the
    autocomplete widget is __match_string__. This can be overwritten by adding the match_string value in cellEditorParams.

    A custom function to create the match_string can be added to cellEditorParams. The function takes a row from selectValues
    and adds the corresponding search field to it. i.e
        function (select_value_row) {
            var match_string = some calculation
            select_value_row['__match_string__'] = match_string
        }
    */
    var match_string_name = '__match_string__'
    if ( grid_column_rule['cellEditorParams'].hasOwnProperty('match_string') ) {
        match_string_name = grid_column_rule['cellEditorParams']['match_string']
    }

    if ( grid_column_rule['cellEditorParams'].hasOwnProperty('match_string_function')) {
        var mxf = grid_column_rule['cellEditorParams']['match_string_function']
        var selectValues = grid_column_rule['cellEditorParams']['selectValues']
        selectValues.forEach( (select_value) => mxf(select_value) )
    } else {
        var selectValues = grid_column_rule['cellEditorParams']['selectValues']
        var match_string = ''
        var i;
        var objx
        var k;
        for (i in  selectValues) {
            objx = selectValues[i]
            match_string = ''
            for (k in objx ) {
                match_string += String(objx[k]).toLowerCase()
            }
            match_string = match_string.replace(/\s/g, '')
            objx[match_string_name] = match_string 
        }
    }

}

function AppendToAutcompleteMapObject(grid_column_rule, autocomplete_map) {
    /*
    This function add map data to the autocomplete_map object. The field name where the autocomplete data is entered in the
    grid is used as the key for the autocomplete_map

    Returns:
        Appends new object to autocomplete_map
        selectValue: All values in selectValue which is array used to search for the field of interest
        key: this is the return_value. Its used as the key in the mapFunction. The key references the row contained the corresponding data
        mapFunction: this is an object that mfx[key] -> select_value_row 
        crud_value: this is the column to return when saving data to the server. For example, for npi the npi widget will have
            return_value: 'npi'. This will cause the grid to return the npi to the user on display. But when sending to the postgres
            server the corresponding id for the provider row is needed. so crud_value will be set to 'id'
        return_field: this is used to change the name of the field column to something else. This occurs when the column where
            the data is being pulled from is named differently then the column being saved to. For example data pull comes from
            classification_name but save goes to classification_id
    */
    var mfx = grid_column_rule['cellEditorParams']['map_function']
    var key = grid_column_rule['cellEditorParams']['return_value']
    var selectValues = grid_column_rule['cellEditorParams']['selectValues']
    var crud_value = grid_column_rule['cellEditorParams']['crud_value']
    var return_field = ""
    if (grid_column_rule['cellEditorParams'].hasOwnProperty('return_field') ) {
        return_field = grid_column_rule['cellEditorParams']['return_field']
    }
    var map_name = grid_column_rule['field']
    autocomplete_map[map_name] = {'selectValues': selectValues, 'mapFunction': mfx, 'return_value': key, 'crud_value': crud_value, 'return_field': return_field }


}

function CreateMapFunction(grid_column_rule) {
    /*
    This function creates a map function that takes the selectValues array and creates a function that uses the return_value as a key
    and return the corresponding row in selectValues. The return_value is expected to be some form of unique id representing the row

    The map_function is used for calculated fields. They will use map_function[return_value from column]['columnName'] to display a
    particular value
    */
    var key = grid_column_rule['cellEditorParams']['return_value']
    var mfx = {}
    var selectValues = grid_column_rule['cellEditorParams']['selectValues']
    for (let i = 0; i < selectValues.length; i++) {
        var select_value = selectValues[i]
        mfx[String(select_value[key] )] = select_value
    }
    grid_column_rule['cellEditorParams']['map_function'] = mfx
}

function IsAutocompleteColumn(grid_column_rule) {
    //Check if column uses the autocomplete widget
    if (! grid_column_rule.hasOwnProperty('cellEditorFramework') ) {return false}
    if (grid_column_rule['cellEditorFramework'] === 'AutocompleteAg' ) {return true}
    else { return false}
}

//Need to create a property checker. Verify everything is correct.
//console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');


module.exports = {
    'InitializeAutocompleteMaps': InitializeAutocompleteMaps,
    'IsAutocompleteColumn': IsAutocompleteColumn,
    'ConsoleLog': ConsoleLog
}