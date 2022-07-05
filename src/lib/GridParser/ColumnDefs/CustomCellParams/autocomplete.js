/*
Responsible for creating each columns rules for displaying and formatting the data.

1.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.

    api_route: 

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: for sorting purposes? (maybe requires sortField)
    cellEditor: "autoComplete"
    cellEditorParams: {
        values: [] //always object
        //not implemented yet.
        lookupFieldsMainQuery: [ {} ] //list of fields
        lookupFieldsColumn: [ {}] //list of fields

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

//renaming?
mainQueryFieldNames to grid [
    {'server_field_name': 'ui_field_name'}
]

*/

const type_check   = require('../../../TypeCheck')
const pushPullInit = require('./pushPullDisplay')


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
        pushPullInit(grid_column)
        this.DefaultParameters()
        this.ValueGetter()
    }


    DefaultParameters() {
        let grid_column  = this.grid_column
        let valuesObject = this.valuesObject
        let cep = grid_column['cellEditorParams']
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
        if (! cep.hasOwnProperty('values')) {cep['values'] = valuesObject}

    }

    AutocompleteDefaultColumnDef(pullKey, displayKey, columnWidth) {
        //default columnDef for lookups.
        return [{'field':pullKey, "width": columnWidth}, {'field': displayKey, "width": columnWidth}]
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

module.exports = {'CustomEditor': CustomEditor, 'ReturnGridValuesObject': ReturnGridValuesObject}