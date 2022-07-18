/*
Explicitly set all default values for headerName, ag grid column formattings
and validation parameters and ifNull


Creates default value object. This is used to set default values in new rows and
replace null values if needed.
defaultValue: {'value': 'string', 'dataType': '',  ifNullSet: true/false } key for object or array


// add conditions for row height
// for row height
// <ag-grid-vue
//     :getRowHeight="getRowHeight"
//     /* other grid options ... 
//     </ag-grid-vue>

//     this.getRowHeight = params => params.node.group ? 50 : 20;

// add conditions for is editable //insert only or update only?
// add conditions parser?

*/

const type_check  = require('../../../TypeCheck')
const data_config = require('../../../DataConfig')
const meta_column_name = data_config['meta_column_name']

//need to deep copy objects
// where is IfNull parameter handled?
//has whole grid object. Any data loading comes from
//grid_funcs. Vue Components can also have async await
class DefaultParams {

    constructor(grid) { this.grid  = grid }

    DefaultParamsInit() {
        /*
        Main function for initializing default values for main grid
        */
        for(let i=0; i < this.grid.length; i++) {
            let grid_column = this.grid[i]
            if (grid_column['field'] === meta_column_name ) { continue }
            this.DefaultParameters(grid_column)
            this.DefaultValue(grid_column)
            this.HeaderName(grid_column)
        }
    }

    SubGridDefaultParamsInit(rowData, rowDataDefaults) {
        /*
        Main function for initializing default values for sub grid

        Order of operations.
        Run DefaultParamsInit
        Then run cellEditorParams init why??
        then run SubGridDefaults

        rowData if from the row that calls the subGrid
        rowDataDefaults is from the subGrid columnDefs

        */
        for(let i=0; i < this.grid.length; i++) {
            let grid_column = this.grid[i]
            if (grid_column['field'] === meta_column_name ) { continue }
            this.DefaultParameters(grid_column)
            let rowDataDefaultValues = rowDataDefaults['defaultValues']
            this.SubGridDefaultsValues( rowData, rowDataDefaultValues )
            this.DefaultValue(grid_column)
            this.HeaderName(grid_column)
        }
    }

    HeaderName(grid_column) {
        if (! grid_column.hasOwnProperty('headerName')) {
            grid_column['headerName'] = grid_column['field']
        }

    }


    DefaultValue(grid_column) {
        /*
            Adds default object to gridColumn
            value is default value to be used when creating new row or changing value before save
            ifNullSet if true will change null to default value on save
            defaultValue: {'value': 'string', 'dataType': '',  ifNullSet: true/false }

        */
        if (! grid_column.hasOwnProperty('defaultValue') ) {
            grid_column['defaultValue'] = {'value': null, 'dataType': this.DataType(grid_column), 'ifNullSet': false}
            return
        }
        let x = grid_column['defaultValue']
        if (type_check.IsNull(x) ) {
            grid_column['defaultValue'] = {'value': null, 'dataType': this.DataType(grid_column), 'ifNullSet': false}
        }
        else if (type_check.IsBasicType(x)  ) {
            grid_column['defaultValue'] = {'value': String(x), 'dataType': this.DataType(grid_column), 'ifNullSet': false}
        }
        else if (type_check.IsArray(x)) {
                grid_column['defaultValue'] = {'value': x, 'dataType': this.DataType(grid_column), 'ifNullSet': false}
        } else if (type_check.IsObject(x)) {
            //add parameters to defaultValues Object
            if (! x.hasOwnProperty('value'))       { grid_column['value']  = null }
            if (! x.hasOwnProperty('ifNullSet'))   { x['ifNullSet'] = false }
            if (! x.hasOwnProperty('dataType'))    { x['dataType'] = grid_column['dataType']}
                
        } else {
            grid_column['defaultValue'] = {'value': null, 'dataType': this.DataType(grid_column), 'ifNullSet': false}
        }
    }

    DataType(grid_column) {
        let data_type = grid_column['dataType'] || 'text'
        return data_type
    }

    DefaultParameters(grid_column) {
        /* Add default condtions to column */
        //editable and chmodParams permissions

        if (! grid_column.hasOwnProperty('isRequired'))  { grid_column['isRequired']  = false }
        if (! grid_column.hasOwnProperty('ignoreError')) { grid_column['ignoreError'] = false }
        if (! grid_column.hasOwnProperty('dataType'))    { grid_column['dataType'] = 'text'}
        if (! grid_column.hasOwnProperty('width'))       { grid_column['width'] = 500 }
        if (! grid_column.hasOwnProperty('editable') )   { grid_column['editable'] = false }
        if (! grid_column.hasOwnProperty('hide') )       { grid_column['hide'] = false }
        if (! grid_column.hasOwnProperty('cloneOnCopy') ){ grid_column['cloneOnCopy'] = false }
        //cloneOnCopy if true add fields values to new row else set as null

        this.IfNull(grid_column)
    }
    IfNull(grid_column) {
        /*
            raw postgres string to replace null values with.
        */
        let if_null_value = grid_column['ifNull'] || null
        if (if_null_value===null || if_null_value === 'null') { grid_column['ifNull'] = 'null' }
        else if (!data_config.if_null_types.includes(if_null_value) ) {
            let field = grid_column['field']
            console.error(`invalid ifNull type for ${field}`)
            grid_column['ifNull'] = 'null'
        }
    }

    //ifNull verify valid null string and replace if not.
    //runs defaultParameters, SubGridDefaultValues, DefaultValues,
    SubGridDefaultValues( rowData, rowDataDefaults ) {
        /*
        rowDataDefaults = {
            'defaultValues':  {subGridKey: {rowKey: , paramsKeys:  ifNullSet: boolean  } } 
        }
        */
        let gridDefaultValues = {}
        let subgrid = this.grid

        let subGridFields = Object.keys(rowDataDefaults)
        for (let i =0; i < subGridFields.length; i++ ) {
            let sgx    = subGridFields[i]
            let rowKey = sgx['rowKey']
            dx = {}
            if (sgx.hasOwnProperty('paramsKey') ) {
                let pkey  = sgx['paramsKey']
                let value = rowData[rowKey][pkey]
                dx['value'] = value
                dx['ifNullSet'] = sgx['ifNullSet'] || false
                gridDefaultValues[sgx] = dx
            } else {
                let value = rowData[rowKey]
                dx['value'] = value
                dx['ifNullSet'] = sgx['ifNullSet'] || false
                gridDefaultValues[sgx] = dx
            }
        }
        for (let i =0; i < subgrid.length; i++ ) {
            let field = subgrid['field']
            if (! gridDefaultValues.hasOwnProperty(field) ) { continue }
            let dataType = this.DataType(grid_column)
            let dx = gridDefaultValues[field]
            dx['dataType'] = dataType
            subgrid['defaultValue'] = dx
        }
    }
}


module.exports = DefaultParams