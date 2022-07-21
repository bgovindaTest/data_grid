/*
Main functions for converting and mapping data in rowData and assembling
it into a data object to be sent to the server.

This module is called an ran by the grid_func.js mixin

//default values
*/
const type_check      = require('../../../lib/TypeCheck')
const data_config     = require ('../../../lib/DataConfig')
const meta_column     = data_config['meta_column_name']
const chmodFunc       = require('../../../lib/chmodFunc')
const lodashCloneDeep = require('lodash.clonedeep')


class Push {
    constructor(columnDefs) {
        this.columnDefs             = columnDefs
        this.pushFieldParams  = []
        this.pushLookupParams = {}
        this.pushValueGetters = {}
    }
    PushParamsInit( ) {
        let columnDefs = this.columnDefs
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
        //main function to create rowData object to be sent to the server for saving
        let cx =this.CrudType(rowData, reqBody)
        let rd =this.MapRowData(rowData, cx['crudType'], cx['set_filters'] )
        return rd
    }
    MapRowData(rowData, crudType, set_filters) {
        /*
            Parses rowData fields that are lookups, valueGetters and and pushes other
            data to rowDataOut. crudType determines how rowDataOut is assembled.

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
        /*
        Creates crudType object rowData meta column as the default crud behavior i.e
        insert for new rows, update for pulled and delete for delete.

        reqBody allows for an instead of quer to be set. It stored in reqBody[uiCrudType][crudType]
        */
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
        /*
        Creates main object to be sent to the server. Also returns
        the route to send the payload
        */
        let reqBody = lodashCloneDeep( reqBodyParams[uiCrudType] )
        let route   = reqBody['route']
        reqBody['data'] = data
        return {'reqBody': reqBody, 'route': route} 
    }
    //error handling?
}

module.exports = Push