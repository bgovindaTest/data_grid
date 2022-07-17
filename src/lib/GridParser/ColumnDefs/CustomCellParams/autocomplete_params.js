/*
Responsible for creating each columns rules for displaying and formatting the data.

1.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: dtype of field
    cellEditor: "autoComplete"
    cellEditorParams: {
        values: [{}] //always object
        columnDef: [
            {header: "id" , field: "id", width: 50},
            {header: "name", field: "name", width: 50},
            {header: "username", header: "username", width: 75 },
            {header: "email", header: "username",  width: 200 },
            {header: "phone", header: "username",  width: 150 },
            {header: "website",header: "username", width: 100 }
        ]
        api_route: url_string
            this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
            to extract the selectValues array. 
            use post or get route?

        pushKey = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        pullKey = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        displayKey = grid_column["cellEditorPrams"]['displayKey'] //defaults to id

    }

pushKey gets converted into pullKey naming when reading from server. All other fields added to object
based on . operator.

i.e provider_id -> id
provider_id.first_name -> name

*/

const type_check   = require('../../../TypeCheck')
const auxFuncs = require('./auxilary_funcs')
const PushPullInit = auxFuncs['PullPushDisplayKeys']
const CellEditorParamsCheck = auxFuncs['CellEditorParamsCheck']


class AutocompleteParams {
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
        this.defaultColumnWidth = 150
    }
    AutoCompleteParamsInit() {
        /*
        Initializes the autocomplete editor. columnDefs and values.
        Data is pulled in grid_funcs
        */
        let grid_column  = this.grid_column
        PushPullInit(grid_column)
        this.DefaultParameters()
        this.ValueGetter()
        grid_column['cellEditorPopup'] = true
    }


    DefaultParameters() {
        /*
        Adds default cellEditorParams
        */

        let grid_column  = this.grid_column
        //check if missing cellEditorParams
        CellEditorParamsCheck(grid_column)
        let cep = grid_column['cellEditorParams']

        if (! cep.hasOwnProperty('columnDef') ) { this.AutocompleteDefaultColumnDef() } 
        else if ( type_check.IsArray(cep['columnDef'] ) ) {
            if (cep['columnDef'].length === 0) {
                this.AutocompleteDefaultColumnDef()
            }
        } else if ( type_check.IsNull(cep['columnDef'] ) ) {
            this.AutocompleteDefaultColumnDef()
        }
        else{ this.AutocompleteDefaultColumnDef() }
        this.CopyAndStringifyValuesObject()

    }

    AutocompleteDefaultColumnDef(pullKey, displayKey, columnWidth) {
        //default columnDef for lookups.
        let cep = this.grid_column['cellEditorParams']
        let pullKey    = cep['pullKey']
        let displayKey = cep['displayKey']
        let columnWidth = this.defaultColumnWidth
        //if different values
        if (displayKey !== pullKey) {
            cep['columnDef'] = [{'field':pullKey, "width": columnWidth}, {'field': displayKey, "width": columnWidth}]
        } else {
            cep['columnDef'] = [{'field': displayKey, "width": columnWidth}]
        }
        //add pushKey?

    }

    ValueGetter(grid_column) {
        //data is object for autocomplete
        let grid_column = this.grid_column
        if (grid_column.hasOwnProperty('valueGetter')) {return}
        let field = grid_column['field']
        let displayKey = grid_column['displayKey'] 

        let fn = function (params) {
            if (type_check.IsNull(params.data[field]) ) {return null}
            else if ( type_check.IsUndefined(params.data[field]) ) {
                console.error(`undefined`)
                return null
            }
            return params.data[field][displayKey] || null
        }
        grid_column['valueGetter'] = fn
    }
    CopyAndStringifyValuesObject() {
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
        let cep = this.grid_column['cellEditorParams']

        if (! type_check.IsArray(valuesObject)) {
            let field = grid_column['field']
            console.error(`${field} values object is not a json array`)
            cep['values'] = []
            return
        }

        if (valuesObject.length > 0) {
            if (! type_check.IsObject(valuesObject[i]) ) {
                let field = this.grid_column['field']
                console.error(`${field} values is not a json object returning empty object`)
                return values
            }
        }

        for(let i=0; i<valuesObject.length; i++) {
            let x = valuesObject[i]
            //typecheck
            let keys = Object.keys(x)
            let y = {}
            for(let j =0; j<keys.length; j++) {
                y[keys[i]] = String(x[keys[i]])
            }
            values.push(y)
        }
        cep['values'] = values
    }




}

module.exports = AutocompleteParams