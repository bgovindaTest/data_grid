/*

Valid cell editors and processing?


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
        //not implemented yet.
        lookupFieldsRowQuery: [] //list of fields
        lookupFieldsColumnQuery: [] //list of fields

        columnDef: [
            {header: "id" , field: "id", width: 50},
            {header: "name", field: "name", width: 50},
            {header: "username", header: "username", width: 75 },
            {header: "email", header: "username",  width: 200 },
            {header: "phone", header: "username",  width: 150 },
            {header: "website",header: "username", width: 100 }
        ]
        api_route: string
        let push_key = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        let pull_key = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        let display_key = grid_column["cellEditorPrams"]['displayKey'] //defaults to id

    }




 cellEditor: 'agRichSelectCellEditor',
 //parse map object into values array
 allowNull
 cellEditorParams: {
     values: ['Male', 'Female'],
     
     key is first?
     cellEditorPopup: true,
        let push_key = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        let pull_key = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        let display_key = grid_column["cellEditorPrams"]['displayKey'] //defaults to id

    pullKey:     //pullAndDisplay same key
    pushKey: 
    displayKey:  (this goes into values)
    pushKey:  //name of columns sent ot the server.
    api: string
    mapObject: {key: value} takes select value and returns other value for crud
    row_filter

   },
},

//SubGrid Params here
AutoComplete and Aggrid PullDown:

subgrid params (valid names and default)

rowDataDefaults = {
    'defaultFilter': [] key value? fro row params
    'defaultValue':  []
}


*/
const type_check = require('../../../TypeCheck')



class CustomEditor {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
    }
    AutoCompleteParams() {
        /*
        Initializes the autocomplete editor. columnDefs and values.
        Data is pulled in grid_funcs
        */
        let grid_column  = this.grid_column
        let valuesObject = this.valuesObject

        let cep = grid_column['cellEditorParams']
        if (! cep.hasOwnProperty('pushKey')) { cep['pushKey'] = grid_column['field'] }
        if (! cep.hasOwnProperty('pullKey')) { cep['pullKey'] = 'id' } //pull key is assumed to be the primary key for lookup
        if (! cep.hasOwnProperty('displayKey')) { cep['pullKey'] = cep['pushKey'] } //pull key is assumed to be the primary key for lookup
        cep['values'] = values_object
        let pullKey = cep['pullKey']
        let displayKey = cep['displayKey']
        let colSize = 150
        if (! cep.hasOwnProperty('columnDef') ) {
            cep['columnDef'] = this.AutocompleteDefaultColumnDef(pullKey, displayKey, colSize)
        } else if ( type_check.IsArray(cep['columnDef'] ) ) {
            if (cep['columnDef'].length === 0) {
                cep['columnDef'] = this.AutocompleteDefaultColumnDef(pullKey, displayKey, colSize)
            }
        } else if ( type_check.IsNull(cep['columnDef'] ) ) {
            cep['columnDef'] = this.AutocompleteDefaultColumnDef(pullKey, displayKey, colSize)
        }
        else{ cep['columnDef'] = this.AutocompleteDefaultColumnDef(pullKey, displayKey, colSize) }
        this.AutoCompleteValueGetter()
        if (! cep.hasOwnProperty('values')) {cep['values'] = valuesObject}
    }

    AutocompleteDefaultColumnDef(pullKey, displayKey, columnWidth) {
        //default columnDef for lookups.
        return [{'field':pullKey, "width": columnWidth}, {'field': displayKey, "width": columnWidth}]
    }

    AutoCompleteValueGetter() {
        let grid_column = this.grid_column
        if (grid_column.hasOwnProperty('valueGetter')) {return}
        grid_column['valueGetter'] = AutoCompleteValueGetter(grid_column(grid_column['cellEditorParams']['displayKey']))
    }
    AgRichSelectParams() {
        //create map object
        //create values object
        let grid_column  = this.grid_column
        let cep = grid_column['cellEditorParams']
        if (! cep.hasOwnProperty('pushKey')) { cep['pushKey'] = grid_column['field'] }
        if (! cep.hasOwnProperty('pullKey')) { cep['pullKey'] = 'id' } //pull key is assumed to be the primary key for lookup
        if (! cep.hasOwnProperty('displayKey')) { cep['displayKey'] = cep['displayKey'] || cep['pushKey'] }
        let valsParams = this.ValuesAgRichSelectParams()
        cep['values'] = valsParams['values']
        cep['mapObject'] = valsParams['mapObject']
    }
    ValuesAgRichSelectParams() {
        //key value
        //displayKey must be unique. maps to mapsObject.
        //pushKey is name of key to send
        //pullKey is name sent by columns lookup
        let valuesObject = this.valuesObject
        let values = []
        let mapObject = {}
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        let pushKey = this.grid_column['cellEditorParams']['pushKey']
        let pullKey = this.grid_column['cellEditorParams']['pullKey']

        for(let i=0; i<valuesObject.length; i++) {
            let x = valuesObject[i]
            let pull_id = x[pullKey]
            mapObject[displayKey] = {pushKey: String(pull_id)} // {'id: 1} -> {'user_id': 1}
            values.push(displayKey)
        }
        return {'values': values, 'mapObject': mapObject}
    }

    DeleteUndoSelector() {/*? defaults? */}


    SubGridParams(grid_column) {
        let is_subgrid = grid_column['cellEditor'] || ""
        if (is_subgrid != "subGrid") { return }
        let subgridPos = grid_column["cellEditorPrams"]['gridPos'] || 0
        //make integer.
        if (subgridPos === 0 ) {
            console.log('Subgrid out of bounds')
            return 
        }
        //valuesArray
        //mapObject
    }
    AddDefaultValueSetter() {
        //adds default valueSetter. returns null when type is invalid 
        let gc = this.grid_column
        AddValueSetter(gc) 
    }

}

function AutoCompleteValueGetter(displayKey) {
    //data is object for autocomplete
    let fn = function (params) {
        return params.data[displayKey] || null
    }
    return fn
}


let lookupCellEditors = ["autoComplete", "agSelectCellEditor", "deleteUndoSelector"]
function AddValueSetter(grid_column) {
    /*
    Adds value setter to numbers, boolean and date. If not correct format return null
    */
    let ce = grid_column['cellEditor']
    if (lookupCellEditors.includes(ce)) {return}


    if (grid_column.hasOwnProperty('valueSetter')) {return}
    let field = grid_column['field']

    //numbers
    let number_types = ['smallint', 'integer', 'int', 'bigint', 'decimal', 'numeric',
    'real', 'double precision', 'money', 'numeric', 'float']

    if (number_types.includes(grid_column['dataType'])) {

        let fn = function (params) {
            if (! type_check.IsNumber(params.newValue) ) {
                params.data[field] = null
                return true
            }
            else {
                params.data[field] = params.newValue
                return true
            }
        }
        grid_column['valueSetter'] = fn
        return
    }
    //dates and types. Date transform
    let date_types = ['date', 'timestamp', 'time']
    if (date_types.includes(grid_column['dataType'])) {
        let fn = function (params) {
            if (! type_check.IsDate(params.newValue) ) {
                params.data[field] = null
                return true
            }
            else {
                //type cast?
                params.data[field] = params.newValue
                return true
            }
        }
        grid_column['valueSetter'] = fn
        return
    }
    //boolean
    let bool_types = ['bool', 'boolean']
    if (bool_types.includes(grid_column['dataType'])) {
        let fn = function (params) {
            if (! type_check.IsBoolean(params.newValue) ) {
                params.data[field] = null
                return true
            }
            else {
                //type cast?
                params.data[field] = params.newValue
                return true
            }
        }
        grid_column['valueSetter'] = fn
        return
    }
}

function ReturnGridValuesObject(valuesObject, grid_pos, field_name) {
    //json array. for autocomplete set directly.
    //for richselector parse into values and mapObject
    return valuesObject[grid_pos][field_name] || []
}

module.exports = {'CustomEditor': CustomEditor, 'ReturnGridValuesObject': ReturnGridValuesObject}