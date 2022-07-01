/*
This module handles converting string expression syntax into javascript functions

Handles function processing

If dealing with large number CreateFunction requires big parameter

How to handle required fields and type checks

Need error checking.

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
requiredFieldsTypeCheck: true //unchangeage
nullReplace: true



*/
const data_types = require ('../../DataConfig')
const type_check = require('../../TypeCheck')
const mathjs     = require('mathjs')
const create     = mathjs['create']
const all        = mathjs['all']
let null_dtype_to_value = data_types['null_dtype_to_value']

// import {create, all} from 'mathjs'
// import type_check from '../../TypeCheck'

const math = create(all)
const math_big = create(all)

//initialize big number configuration
math_big.config({ number: 'BigNumber', precision: 64 })

function ifnull(x, alt_x) {
    if (type_check.IsNull(x) || type_check.IsUndefined(x) ) {return alt_x}
    return x
}

function cast(x, data_type) {}

function lookup(lookup_column, lookup_column_name, params) {
    let dx = params.data
    if (!dx.hasOwnProperty(lookup_column)) {return null}
    let lx = dx[lookup_column]
    if (!IsObject(lx ) )   {return null}
    else if ( !lx.hasOwnProperty[lookup_column_name] ) {return null}
    return lx[lookup_column_name]
}


function ImportFunctions(mathx) {
    mathx.import({
        "ifnull": ifnull,
        "lookup": lookup,
        'isobject': type_check.IsObject,
        'isstring': type_check.IsString,
        'isarray': type_check.IsArray,
        'isboolean': type_check.IsBoolean,
        'isnumber': type_check.IsNumber,
        'isbasictype': type_check.IsBasicType,
        'isnull': type_check.IsNull,
        'isinteger': type_check.IsInteger,
        'isdate': type_check.IsDate,
        'istime': type_check.IsTime,
        'isdatetime': type_check.IsDateTime,
        'istimestamp': type_check.IsDateTime,
        'isundefined': type_check.IsUndefined
    })
}

function CreateScopeObject (params, globals) {
    //params_data is params.data from aggrid rows
    let params_data = params.data
    let scopex = {}
    let params_keys = Object.keys(params_data)
    for (var i=0; i < params_keys.length; i++) {
        scopex[params_keys[i]] = params_data[ params_keys[i] ]
    }
    // console.log(globals)
    let keys = Object.keys(globals)
    for (var i=0; i < keys.length; i++) {
        scopex[keys[i]] = globals[ keys[i] ]
    }
    return scopex
}


function CreateFunction(expression, mjx_type=null) {
    let mx = math
    if (mjx_type === 'big' ) {
        mx = math_big
    }
    return mx.compile(expression)
}

function DeactivateInsecureFunctions(mathx) {
    //need to call after grid initialization?
    mathx.import({
        import: function () { throw new Error('Function import is disabled') },
        createUnit: function () { throw new Error('Function createUnit is disabled') },
        evaluate: function () { throw new Error('Function evaluate is disabled') },
        parse: function () { throw new Error('Function parse is disabled') },
        simplify: function () { throw new Error('Function simplify is disabled') },
        derivative: function () { throw new Error('Function derivative is disabled') }
      }, { override: true })
}

function EvaluateFunction(fn, params, globals) {
    //add globals?
    let scope = CreateScopeObject(params, globals)
    //if scope === null
    //return null
    return fn.evaluate(scope)
}

function CreateAggridFunction( expr, globals, options ) {

    let mathjs_type_set = null
    if (options.hasOwnProperty['mathjs_type_set'] ) { mathjs_type_set = options['mathjs_type_set'] }
    //options is big
    let requiredFields = null
    if (options.hasOwnProperty['requiredFields'] ) { requiredFields = options['requiredFields'] }
    if (!type_check.IsArray(requiredFields)) {requiredFields = null}

    let fx = CreateFunction(expr, mathjs_type_set )
    if (requiredFields === null) {
        let fn = function (params) {
            try{
                let res = EvaluateFunction(fx, params, globals)
                return res
            } catch (error) {
                console.error(error)
                return null
            }
        }
        return fn
    } else {
        //has required fields
        let fn = function (params) {
            for(let i =0; i < requiredFields.length; i++) {
                let field = requiredFields[i]
                let cell_value = params.data[field]
                if (type_check.IsNull(cell_value) || type_check.IsUndefined(cell_value) ) {return null}
            }
            try{
                let res = EvaluateFunction(fx, params, globals)
                return res
            } catch (error) {
                console.error(error)
                return null
            }
        }
        return fn
    }
}

//adds user defined functions
ImportFunctions(math)
ImportFunctions(math_big)


//
function HasRequiredFields(rowData, requiredFields) {
    for (let i =0; i < requiredFields.length; i++) {
        let rf = requiredFields[i]
        if (! rowData.hasOwnProperty(rf)) {return false}
        if (type_check.IsNull(rowData[rf])) {return false}
    }
    return true
}

function NullValue(cell_value, data_type) {
    //if null replaces with value for calculaiton i.e. 0 for numbers
    //and empty string for text
    if (type_check.IsNull(cell_value)) {
        return null_dtype_to_value[data_type] || null
    }
    return cell_value
}

function GridColumnRequiredFields(grid_column) {
    let tmp = []
    if (grid_column.hasOwnProperty('requiredFields')) {
        let rf = grid_column['requiredFields']
        if (! type_check.IsArray(rf)) {
            grid_column['requiredFields'] = []
        } else {
            for(let i =0; i < rf.length; i++) {
                tmp.push(rf[i])
            }
        }
    }
    if (! grid_column.hasOwnProperty('validatorRequiredFields')) {
        grid_column['validatorRequiredFields'] = []
    } else {
        if (! type_check.IsArray(grid_column['validatorRequiredFields'])) {
            grid_column['validatorRequiredFields'] = []
        }
    }
    if ( ! grid_column.hasOwnProperty('valueGetterRequiredFields') ) {
        grid_column['valueGetterRequiredFields'] = []
    } else {
        if (! type_check.IsArray(grid_column['validatorRequiredFields'])) {
            grid_column['validatorRequiredFields']
        }
    }

}

module.exports = {
    "math":math,
    "math_big": math_big,
    "CreateScopeObject": CreateScopeObject,
    "CreateFunction": CreateFunction,
    "DeactivateInsecureFunctions": DeactivateInsecureFunctions,
    "EvaluateFunction":EvaluateFunction,
    "CreateAggridFunction": CreateAggridFunction
}