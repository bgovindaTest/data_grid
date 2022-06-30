/*
Responsible for creating each columns rules for displaying and formatting the data.

Valid cell editors and processing?

grid_init.js is the main module to initialize the app.
grid_column_rules Input Parameters: These also go in the grid_column_rules. It used to set the how user enters data. Two options are below.

1.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.

    api_route: this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
        to extract the selectValues array. 
        use post or get route?

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: for sorting purposes? (maybe requires sortField)
    cellEditorFramework: "autoComplete" || cellEditor?
    cellEditorParams: {
        values: [] //always object
        //not implemented yet.
        lookupFieldsPull: [] //list of fields
        lookupFieldsDisplay: [ {}] //list of fields

        columnDef: [
            {header: "id" , field: "id", width: 50},
            {header: "name", field: "name", width: 50},
            {header: "username", header: "username", width: 75 },
            {header: "email", header: "username",  width: 200 },
            {header: "phone", header: "username",  width: 150 },
            {header: "website",header: "username", width: 100 }
        ]
        api_route: url_string
        pushKey = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        pullKey = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        displayKey = grid_column["cellEditorPrams"]['displayKey'] //defaults to id

    }

2.) agRichSelectCellEditor

cellEditor: 'agRichSelectCellEditor',
cellEditorParams: {
    values: ['Male', 'Female'],
    allowNull: prepends null value to beginning of values array
    cellEditorPopup: true,
    pushKey: =  //defaults to field
    pullKey: =  //defaults to id //pullAndDisplay same key
    displayKey: //defaults to id (this goes into values)
    api: url_string
    mapObject: {key: value} takes select value and returns other value for crud
        mapObject[rowData['field] ] = {pushKey: pull_id}
   },
},

3.) subGrid
subGridPos
rowDataDefaults = {
    'defaultFilter': [] key value? fro row params
    'defaultSort': []
    'enforcedFilters': []
    'defaultValue':  []
}
rowDataDefaults pulls data from calling row to assemble subgrid

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
        /*
        Displays the values of paramsObject specified by displayKey
        */
        let grid_column = this.grid_column
        if (grid_column.hasOwnProperty('valueGetter')) {return}
        grid_column['valueGetter'] = AutoCompleteValueGetter(grid_column(grid_column['cellEditorParams']['displayKey']))
    }
    AgRichSelectParams() {
        /*
        This creates the values and mapObject for the dropdown 

        */
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
        /*
        Parses values object and returns values for drop down and the map object.
        The map object 
         object.
            //key value
            //displayKey must be unique. maps to mapsObject.
            //pushKey is name of key to send
            //pullKey is name sent by columns lookup

        */
        let valuesObject = this.valuesObject
        let values = []
        let mapObject = {}
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        let pushKey = this.grid_column['cellEditorParams']['pushKey']
        let pullKey = this.grid_column['cellEditorParams']['pullKey']

        for(let i=0; i<valuesObject.length; i++) {
            let x = valuesObject[i]
            let pull_id = x[pullKey]
            let y = {}
            y[pushKey] = String(pull_id)

            mapObject[displayKey] = y // {'id: 1} -> {'user_id': 1}
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


// function SubGridRowDataDefaults(grid_column, rowDataDefaultRules, rowData) {
//     /*
//     Adds vales from row to create submodal grid.
//     rowDataDefaults = {
//         'defaultFilter': [] key value? fro row params
//         'defaultSort': []
//         'enforcedFilters': []
//         'defaultValue':  []
//     }

//     */
//     return

// }

module.exports = {'CustomEditor': CustomEditor, 'ReturnGridValuesObject': ReturnGridValuesObject}