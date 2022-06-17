/*
Process and store OrderBy and FilterParams

ui_fileds

{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null },

//value2 used for between and not_between
//otherwise eveything stored in value

let where_statements = [
    {'column_name': 'col_name_1', 'operator': '=', 'value':  1 },
    {'column_name': 'col_name_2', 'operator': 'is_null', 'value':  "" },
    {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a' },
]

Creates Functions for processing

*/
let valid_operators = {'=': '=', '!=': '!=', 
    '<>': '<>', '>':'>', '>=': '>=', 
    '<': '<', '<=': '<=', 
    
    'lt': '<', 'le':'<=' , 'gt': '>',
    'ge': '>=', 'eq': '=', 'neq': '!=',
    'in':'IN',
    'not_in': "NOT IN", 
    'similar': "SIMILAR TO", 'not_similar': "NOT SIMILAR TO",
    'like': "LIKE",  'not_like': "NOT LIKE", 'ilike': "ILIKE",
    'not_ilike': "NOT ILIKE",
    'between': "BETWEEN SYMMETRIC", 'not_between': "NOT BETWEEN SYMMETRIC" , 'is_null': "IS NULL", 
    'is_not_null': "IS NOT NULL",
    //create in statements with like and ilike 
    'like_in': "LIKE ANY", 'not_like_in': "NOT LIKE ALL",
    'ilike_in': "ILIKE ANY", 'not_ilike_in': "NOT ILIKE ALL",
}
let like_in  = ['like_in', 'not_like_in', 'ilike_in', 'not_ilike_in' ]





let sort_type = ['asc', 'desc']


let sortDisplayName = {'asc': 'ascending', 'desc': 'descending'}

let text_types = []
let date_types = []

//between operator
let date_operators   = [
    '=','!=','>', '>=', 
    '<','<=','is_null',
    'is_not_null', 'between',
    'not_between'
]

let text_operators   = [
    'like', 'not_like', 'in', 'not_in',
    'between', 'not_between', 'is_null',
    'is_not_null',
    '=','!='
]

let number_operators = [
    '=','!=','>', '>=', 
    '<','<=', 'in', 'not_in', 'is_null',
    'is_not_null', 'between', 'not_between'
]

function AddDefaultFilter(column_name) {


}

function AddDefaultOrderBy(column_name) {}



function DelimiterType () {} //how to split and return value


function ProcessFilter ( filterParams ) {
    let current_params = filterParams['current_params']
}

function ProcessOrderBy (orderbyParams) {

}


//Parse and reject
//invalid data ignore warning
//Reject values
//Warning?