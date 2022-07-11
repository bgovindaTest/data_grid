/*
Explicitly set all default values for headerName, ag grid column formattings
and validation parameters.


Creates default value object. This is used to set default values in new rows and
replace null values if needed.
defaultValue: {'value': 'string', 'dataType': '',  ifNullSet: true/false } key for object or array

*/

const type_check  = require('../../../TypeCheck')
const data_config = require('../../../DataConfig')
const meta_column_name = data_config['meta_column_name']
const lodashCloneDeep = require('lodash.clonedeep')

//need to deep copy objects
// let grid = lodashCloneDeep(this.grid)
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
            this.DefaultValue(grid_column)
            this.DefaultParameters(grid_column)
            this.HeaderName(grid_column)
        }
    }

    SubGridDefaultParamsInit(rowData, rowDataDefaults) {
        /*
        Main function for initializing default values for sub grid

        Order of operations.
        Run DefaultParamsInit
        Then run cellEditorParams init
        then run SubGridDefaults

        rowData if from the row that calls the subGrid
        rowDataDefaults is from the subGrid columnDefs

        */
        this.SubGridDefaults( rowData, rowDataDefaults )
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
        //editable and isCrud permissions

        if (! grid_column.hasOwnProperty('isRequired'))  { grid_column['isRequired']  = false }
        if (! grid_column.hasOwnProperty('ignoreError')) { grid_column['ignoreError'] = false }
        if (! grid_column.hasOwnProperty('dataType'))    { grid_column['dataType'] = 'text'}
        if (! grid_column.hasOwnProperty('width'))       { grid_column['width'] = 500 }
        if (! grid_column.hasOwnProperty('editable') )   { grid_column['editable'] = false }
        if (! grid_column.hasOwnProperty('hide') )       { grid_column['hide'] = false }
        // ifNull: 'psql string calls to replace value'
        // this.IfNull(grid_column)
    }
    SubGridDefaults( rowData, rowDataDefaults ) {
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