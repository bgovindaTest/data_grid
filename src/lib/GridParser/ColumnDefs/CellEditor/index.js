/*

Valid cell editors and processing?


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


    api_route: this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
        to extract the selectValues array. 
        use post or get route?





This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: 
    cellEditorFramework: "autoComplete" || cellEditor?
    cellEditorParams: {
        values: [] //always object

        columnDef: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        api_route: {route: / /, get/post search_key}

            filters:
            orderBy:

        load: app // grid // cell (cell not implemented yet. this would be like realtime)
        let push_key = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        let pull_key = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        let display_key = grid_column["cellEditorPrams"]['displayKey'] //defaults to id

    }




 cellEditor: 'agRichSelectCellEditor',
 allowNull
 cellEditorParams: {
     values: ['Male', 'Female'],
     is_lookup: 
     
     key is first?
     cellEditorPopup: true,
        isDropDown
        let push_key = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        let pull_key = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        let display_key = grid_column["cellEditorPrams"]['displayKey'] //defaults to id

    pullKey:     //pullAndDisplay same key
    displayKey:  (this goes into values)
    pushKey:  //name of columns sent ot the server.
    api:
    load: app // grid // cell
    mapObject: {key: value} takes select value and returns other value for crud
    row_filter

   },
},



*/

let validEditors = []

class CustomEditor {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)
    constructor(grid_column) {
        this.grid_column  = grid_column
    }
    AutoCompleteParams() {}
    AutoCompleteValueSetter() {}
    AutoCompleteValueGetter() {}
    AgRichSelectParams() {}

    SubGridParams() {
        //grid_name or positions

    } //doesnt store any values.


    BooleanValueSetter() {}
    DateValueSetter() {}
    NumberValueSetter() {}
}


/*
BooleanSelector.vue

Cell Editor Params for AgRichSe
'agRichSelectCellEditor'


Custom Value Setters?

*/



//ValueSetters


//ValueGetters



//     },
// }

// function CreateCellParams() {}