/*
This module handles converting string expression syntax into javascript functions

Handles function processing

If dealing with large number CreateFunction requires big parameter
*/
import {create, all} from 'mathjs'
import type_check from '../../TypeCheck'

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
    return fn.evaluate(scope)
}

function CreateAggridFunction( expr, globals, options ) {

    let mathjs_type_set = null
    if (options.hasOwnProperty['mathjs_type_set'] ) {
        mathjs_type_set = options['mathjs_type_set']
    }
    //options is big

    let fx = CreateFunction(expr, mathjs_type_set )
    let fn = function (params) {
        let res = EvaluateFunction(fx, params, globals)
        return res
    }
    return fn
}

//adds user defined functions
ImportFunctions(math)
ImportFunctions(math_big)

module.exports = {
    "math":math,
    "math_big": math_big,
    "CreateScopeObject": CreateScopeObject,
    "CreateFunction": CreateFunction,
    "DeactivateInsecureFunctions": DeactivateInsecureFunctions,
    "EvaluateFunction":EvaluateFunction,
    "CreateAggridFunction": CreateAggridFunction
}