/*
This module handles converting string expression syntax into javascript functions

Handles function processing


IsError
ValueGetter
https://mathjs.org/examples/advanced/web_server/index.html
params

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
        "lookup": lookup
    })
}

function CreateScopeObject (params, globals,global_prefix="") {
    let scopex = params.data
    scopex['_global_'] = globals
    return scopex
}


function CreateFunction(expression, mjx_type=null) {
    let mx = math
    if (mjx_type === 'big' ) {
        mx = math_big
    }
    return math.complile(expression)
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

function EvaluateFunction(mjs_fn, scope, globals) {
    //add globals?
    return mjs_fn.evaluate(scope)
}