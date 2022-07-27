/*
Responsible for creating each columns rules for displaying and formatting the data.

1.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: dtype of field
    cellEditor: "autoComplete"
    validator: if_not object
    cellEditorParams: {
        values: [{}] //always object
        columnDefs: [
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
        valuesObject (optional) if hardcoded into config pull from here
        pushKey = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
        pullKey = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
        displayKey = grid_column["cellEditorPrams"]['displayKey'] //defaults to id also is the return key?

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


class AutoCompleteParams {
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
        //this.ValueGetter()
        //this.ValueSetter()
        this.CellRenderer()
        grid_column['cellEditorPopup'] = true
        grid_column['ignoreError'] = false
    }


    DefaultParameters() {
        /*
        Adds default cellEditorParams
        */

        let grid_column  = this.grid_column
        //check if missing cellEditorParams
        CellEditorParamsCheck(grid_column)
        let cep = grid_column['cellEditorParams']

        if (! cep.hasOwnProperty('columnDefs') ) { this.AutocompleteDefaultColumnDef() } 
        else if ( type_check.IsArray(cep['columnDefs'] ) ) {
            if (cep['columnDefs'].length === 0) {
                this.AutocompleteDefaultColumnDef()
            }
            else {
                this.AutucompleteInitColumnDef()
            }
        } else if ( type_check.IsNull(cep['columnDefs'] ) ) {
            this.AutocompleteDefaultColumnDef()
        }
        else{ this.AutocompleteDefaultColumnDef() }
        this.CopyAndStringifyValuesObject()
        this.CreateMapObject()
    }
    CreateMapObject() {
        let values = this.grid_column['cellEditorParams']['values']
        let mapObject   = {}
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        for (let i =0; i < values.length; i++) {
            let dk = values[i][displayKey]
            mapObject[dk] = values[i]
        }
        this.grid_column['cellEditorParams']['mapObject'] = mapObject
    }

    AutucompleteInitColumnDef() {
        //if array or json array passed
        let cep = this.grid_column['cellEditorParams']
        let pullKey    = cep['pullKey']
        let displayKey = cep['displayKey']
        let columnWidth = this.defaultColumnWidth
        //if different values
        let cdef = cep['columnDefs']
        let ndef = []
        if ( type_check.IsJsonArray(cdef) ) { ndef = cdef } 
        else { for (let i =0; i < cdef.length; i++) { ndef.push({'field': cdef[i]}) } }


        let hasPullKey    = false
        let hasDisplayKey = false

        for(let i = 0; i < ndef.length; i++ ) {
            let nx    = ndef[i]
            let field = nx['field'] || ""
            if (field === "") { console.error(`missing field for autocomplete`)}
            if (! nx.hasOwnProperty('width')) {nx['width'] = columnWidth}
            if (field === displayKey) { hasDisplayKey = true}
            if (field === pullKey)    { hasPullKey = true}
        }


        if (!hasPullKey) {
            ndef.push( {'field':pullKey, "width": columnWidth})
        } 
        if (!hasDisplayKey) {
            ndef.push({'field': displayKey, "width": columnWidth})
        }
        cep['columnDefs'] = ndef



    }



    AutocompleteDefaultColumnDef() {
        //default columnDef for lookups.
        let cep = this.grid_column['cellEditorParams']
        let pullKey    = cep['pullKey']
        let displayKey = cep['displayKey']
        let columnWidth = this.defaultColumnWidth
        //if different values
        if (displayKey !== pullKey) {
            cep['columnDefs'] = [{'field':pullKey, "width": columnWidth}, {'field': displayKey, "width": columnWidth}]
        } else {
            cep['columnDefs'] = [{'field': displayKey, "width": columnWidth}]
        }
        //add pushKey?
    }

    ValueGetter() {
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
    CellRenderer() {

        let cep = this.grid_column['cellEditorParams']
        let displayKey = cep['displayKey']
        this.grid_column['cellRenderer'] = function (params) {
            let val = params.value // params.data[field][displayKey] || null
            if (val === null || typeof val === 'undefined') { return `<p></p>` }
            else if (type_check.IsString(val) ) { return `<p>${val}</p>` }
            else {
                val = params.value[displayKey]
                return `<p>${val}</p>`
            }
        }
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
            if (! type_check.IsObject(valuesObject[1]) ) {
                let field = this.grid_column['field']
                console.error(`${field} values is not a json object returning empty object`)
                return values
            }
        }

        for(let i=0; i<valuesObject.length; i++) {
            let x = valuesObject[i]
            let keys = Object.keys(x)
            let y = {}
            for(let j =0; j<keys.length; j++) {
                y[keys[j]] = String(x[keys[j]])
            }
            values.push(y)
        }
        cep['values']  = values
        cep['rowData'] = values
    }
    ValueSetter() {
        // this.grid_column['cellEditorParams']['mapObject'] = mapObject
        this.grid_column['valueSetter'] = this.ValueAutocompleteSetter()
    }

    Validator() {
        //must be object or null. if string means no match found and is error
        let field = this.grid_column['field']
        this.grid_column['validator'] = function (params) {
            let nv = params.data[field]
            if (type_check.IsNull(nv) || type_check.IsUndefined(nv)) {return true}
            else if (type_check.IsObject(nv)) {return true}
            else {return false}
        }
    }

    ValueAutocompleteSetter() {
        /*
        The setter is used for the autocomplete widget. If copy and paste is used it will search against the selectValues
        to try to find the correct row. If no or multiple rows are returned in will return the key_values otherwise it will
        return the return value. If entering in through the autocomplete widget it will return the key_value directly which should
        be available in the
        
        params: object sent from aggrid
        mapObject: map function takes the key_value and returns corresponding row for autocomplete
        selectValues: json array contains values used in autocomplete. Used to search against for newValues if it is not an available
            key for the map_object
        column_match_string: the column created in selectValues. It should have a concatenations of all the columns and its what the key_value
            will search against when not found in the map_object
        columnName: name of the params.data[columnName] where key_value will be saved
        return_value: if the search is used to try to match the key_value to row in selectValues. If only one is found this will be the
            column value thats returned.
        */

        // type_check
        let field        = this.grid_column['field']
        let mapObject    = this.grid_column['cellEditorParams']['mapObject']
        let selectValues = this.grid_column['cellEditorParams']['values']

        const fn = function (params) {
            let nv = params.newValue
            if (typeof nv === 'undefined') { return false }
            if (nv === params.oldValue) {return false}   
            if (nv === null) {
                params.data[field] = null
                return true 
            }
            if (type_check.IsObject(nv) ) {
                params.data[field] = nv
                return true
            }
            if (! type_check.IsString(nv) ) {
                params.data[field] = null
                return true
            }


            if (mapObject.hasOwnProperty(nv)) {
                params.data[field] = mapObject[nv]
                return true
            }


            var key_value = nv

            //Try search
            var mx = String(key_value).toLowerCase()
            var mx_array = mx.split(/[\s,]+/)
            var lookup_list = selectValues.filter((row) => {
                var match_string = row[column_match_string]
                var i = 0;
                for( i in mx_array) {
                    if (match_string.indexOf(mx_array[i]) < 0) {return false}
                }
                return true
            })
            if (lookup_list.length===1) {
                params.data[field] = lookup_list[0]
                return true
            }
            if (key_value.trim() === "") {
                params.data[field] = null
                return true
            }
        
            params.data[field] = key_value
            return true
        }
        return fn
    }
}

module.exports = AutoCompleteParams