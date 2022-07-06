/*
Responsible for creating each columns rules for displaying and formatting the data.

1.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.

    api_route: 

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: dtype of field
    cellEditor: "autoComplete"
    cellEditorParams: {
        values: [] //always object
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
const pushPullInit = require('./pushPullDisplay')


class AutocompleteParams {
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject || []
        this.defaultColumnWidth = 150
    }
    AutoCompleteParamsInit() {
        /*
        Initializes the autocomplete editor. columnDefs and values.
        Data is pulled in grid_funcs
        */
        let grid_column  = this.grid_column
        pushPullInit(grid_column)
        this.DefaultParameters()
        this.ValueGetter()
    }


    DefaultParameters() {
        /*
        Adds default cellEditorParams
        */

        let grid_column  = this.grid_column
        let valuesObject = this.valuesObject
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

        if (! cep.hasOwnProperty('values')) {
            if (! type_check.IsArray(valuesObject)) {
                let field = grid_column['field']
                console.error(`${field} values object is not a json array`)
                cep['values'] = []
            } else { cep['values'] = valuesObject }
        }
    }

    AutocompleteDefaultColumnDef(pullKey, displayKey, columnWidth) {
        //default columnDef for lookups.
        let cep = this.grid_column['cellEditorParams']
        let pullKey    = cep['pullKey']
        let displayKey = cep['displayKey']
        let columnWidth = this.defaultColumnWidth
        cep['columnDef'] = [{'field':pullKey, "width": columnWidth}, {'field': displayKey, "width": columnWidth}]
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

}

module.exports = AutocompleteParams