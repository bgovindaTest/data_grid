/*
Valid cell editors and processing?

Handles dropdowns and xyz

grid_init.js is the main module to initialize the app.


grid_column_rules Input Parameters: These also go in the grid_column_rules. It used to set the how user enters data. Two options are below.


2.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.
    selectValues: [{}] is a json array containing the data shown in the drop down and used in the autocomplete
    return_value: this is value displayed in the cell. Its also used as the key for the mapfunction i.e.
        mapfunction[key] -> id (or some other value). This process is completed during the save function route that sends
        the cell data to the database. This is often the id for the value to be stored in postgres.

    match_string: default __match_string__. Used as the name of the column to set match string value to. 
    match_string_function: function (row, match_string_name) 
        { return //concatenated rows in row[match_string_name]}. This function is run against every row and appends another column labeled
        as match_string_name. users inputs are compared to the text in the match_string_name in order to guide the autocomplete. The match string
        object is also passed to the value_setter as select_values so that the value setter can run on copy paste.
    column_info: json array. Has the header value which must match a value in the selectValues array. init_width is the width to used for the
        autocomplete table.
    map_route: if not empty this is the rest route to pull the map data to. This will overwride anythign previously stored in the selectValues placeholder.
        selectValues can be store statically at each page level when a static drop down is required and no table linking is required.
    map_params: This is a json object that is sent with the axios call with the map route. It can contain additional parameters for making data pull
        from server.

    crud_value: column_name value to send to the server. Often the return value and crud_value are different for example npi maybe stored in the
        cell for the users convience, but the postgres id for that row is sent to the database. 

        The crud_value, return_value and selectValues object are used to create the mapFunction which takes the return_value and uses its as a key
            against select values to return the crud_value. both the return_value and the crud_value should return unique values.

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
        match_string: (string) default __match_string__
        match_string_function: function?
        map_route: string
        map_params: {} 
        crud_value: id
        map_function: //the map function is place here during initializations
}




*/