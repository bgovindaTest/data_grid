/*
Main functions for processing crud events and sending data back and forth
between UI and server.

Creates rowData from server row

//called in grid_funcs mixins inorder to use 
//async await
Process and store OrderBy and FilterParams

ui_fileds

need array of set fields for upsert?

let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
    }
]

// pushKey: =  //defaults to field
// pullKey: =  //defaults to id //pullAndDisplay same key
// displayKey: //defaults to id (this goes into values)

valueGetters

*/

const type_check  = require('../../../lib/TypeCheck')
const data_config  = require ('../../DataConfig')
const meta_column  = data_config['meta_column_name']
const chmodFunc    = require('../../../lib/chmodFunc')
const lodashCloneDeep = require('lodash.clonedeep')


class Push {
    constructor(grid) {
        this.grid             = grid
        this.pushFieldParams  = []
        this.pushLookupParams = {}
        this.pushValueGetters = {}
    }
    PushParamsInit( ) {
        let columnDefs = this.grid
        let le = data_config.cellEditors.lookupEditors
        for (let i =0; i < columnDefs.length; i++ ) {
            let grid_column = columnDefs[i]
            let field       = grid_column['field']
            if (! chmodFunc.IsPush( grid_column['chmodParams']  ) ) {continue}
            let ce = grid_column['cellEditor']
            let vg = grid_column['valueGetter'] || null
            if (le.includes(ce) ) {
                this.pushLookupParams[field] = {'pullKey': grid_column['pullKey'], 'pushKey': grid_column['pushKey']}
                this.pushFieldParams.push(field)
            } else if (type_check.IsFunction(vg) ) {
                this.pushValueGetters[field] = vg
                this.pushFieldParams.push(field)
            } else { this.pushFieldParams.push(field) }
        }
    }
    CreateRowDataOut(rowData, reqBody) {
        let cx =this.CrudType(rowData, reqBody)
        let rd =this.MapRowData(rowData, cx['crudType'], cx['set_filters'] )
        return rd
    }




    MapRowData(rowData, crudType, set_filters) {
        /*
            Parses rowData fields that are lookups and and pushes other
            data to rowDataOut

        //  [metaColumnCrudType][crudType]
        if (crudType === 'delete') {
            Delete(out_data, rowData, crudParams['delete'])
        } else if (crudType === 'insert') { 
            Insert(out_data, rowData, crudParams['insert'])
        } else if (crudType === 'update') {
            Update(out_data, rowData, crudParams['update'])
        } else {
            console.log(`invalid crud type ${crudType}`)
        }


            // pushKey: =  //defaults to field
            // pullKey: =  //defaults to id //pullAndDisplay same key
            // displayKey: //defaults to id (this goes into values)
        */
        let rowDataOut = []
        if (crudType === 'delete') { return rowDataOut.push({'id': rowData['id']}) }

        for (let i =0; i < this.pushFieldsParams.length; i++ ) {
            let field = this.pushFieldParams[i]
            if (crudType === 'update') {
                if (field != 'id' && !set_filters.includes(field)) {continue}
            }

            let x = {}
            if (this.pushLookupParams.hasOwnProperty(field) ) {
                let mapx = this.pushLookupParams[field]
                //default_values
                let pullKey = mapx['pullKey']
                let pushKey = mapx['pushKey']
                x[pushKey] = rowData[pullKey]
                rowDataOut.push(x)
    
            } else if (this.pushValueGetters.hasOwnProperty(field)) {
                let valueGetter = this.pushValueGetters[field]
                let val = valueGetter({'data': rowData })
                rowDataOut.push( val  )
            }
            else {
                //default_values if available
                x[field] = rowData[field]
                rowDataOut.push(x)
            }
        }
        return rowDataOut
    }

    CrudType(rowData, reqBody) {
        let mc = rowData[meta_column]
        let crud_type  = mc[meta_crud_type]
        let is_delete = mc[meta_is_delete]
        if (is_delete) {
            return {'crudType': reqBody['delete']['crudType'], 'set_filters': reqBody['delete']['set_filters'] } 
        } else {
            return {'crudType': reqBody[crud_type]['crudType'], 'set_filters': reqBody['delete']['set_filters'] } 
        }
    }
    CreatePushPayload(reqBodyParams, uiCrudType, data ) {
        //need to get the instead of query
        //also get the route
        //remove
        let reqBody = lodashCloneDeep( reqBodyParams[uiCrudType] )
        let route   = reqBody['route']
        reqBody['data'] = data 
    }
    //error handling?
}

module.exports = {
    'SetCrudData': SetCrudData,
    'SetReqBody':  SetReqBody
}
