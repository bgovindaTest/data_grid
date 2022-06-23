/*
//stores dataTypes and filter operators and alias
main default configuration file
*/

//name of special columns
const meta_column_name = '_ag-meta_'
const meta_delete_undo_name = '_ag-meta-delete-undo_'
const page_size = 10000
const write_batch_size = 1000


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

let operatorAlias = {
    '=': 'Equals', '!=': 'Not Equals', 
    '<>': 'Not Equal', '>':'Greater Than', '>=': 'Greater or Equal To', 
    '<': 'Less Than', '<=': 'Less or Equal To', 
    'lt': 'Less Than', 'le':'Less or Equal To' , 'gt': 'Greater Than',
    'ge': 'Greater or Equal To', 'eq': 'Equals', 'neq': 'Not Equal',
    'in':'In',
    'not_in': "Not In", 
    'similar': "Similar To", 'not_similar': "Not Similar to",
    'like': "Contains",  'not_like': "Not Contains", 'ilike': "Contains",
    'not_ilike': "Not Contains",
    'between': "Between", 'not_between': "Not Between" , 'is_null': "Is Blank", 
    'is_not_null': "Not Blank",
    //create in statements with like and ilike 
    'like_in': "LIKE ANY", 'not_like_in': "NOT LIKE ALL",
    'ilike_in': "ILIKE ANY", 'not_ilike_in': "NOT ILIKE ALL"
}

//determine if string should be split into an array
let array_parse_types  = ['like_in', 'not_like_in', 'ilike_in', 'not_ilike_in', 'in', 'not_in' ]
//determine if values should be stored as array length 2. for between not_between
let between_parse_types  = ['between', 'not_between']
let null_parse_types = ['is_null', 'is_not_null']

let data_classes = ['text', 'number', 'date']
let c = data_classes
//data_types and filter class
//lookups

//numbers
let number_types = ['smallint', 'integer', 'int', 'bigint', 'decimal', 'numeric',
    'real', 'double precision', 'money', 'numeric', 'float']


let data_types = {
    'bigint': c[1],
    'bigserial': c[1],
    'character': c[0],
    'varchar': c[0],
    'text': c[0],
    'char': c[0],
    'date': c[2],
    'int': c[1],
    'integer': c[1],
    'double precision': c[1],
    'money': c[1],
    'json': c[0]
}

//data_type default null values i.e. 0, "", {}, null, [], false
let data_null_types = {
    'bigint': 0,
    'bigserial': 0,
    'character': "",
    'varchar': "",
    'text': "",
    'char': "",
    'date': "01-01-0001",
    'int': 0,
    'integer': 0,
    'double precision': 0,
    'money': 0,
    'array': [],
    'json': {}
}



//data operators
let date_operators   = [
    '=','!=','>', '>=', 
    '<','<=', 'between',
    'not_between', 'is_null',
    'is_not_null'
]

let text_operators   = [
    'ilike', 'not_ilike', 'in', 'not_in',
    'between', 'not_between', 'is_null',
    'is_not_null',
    '=','!='
]

let number_operators = [
    '=','!=','>', '>=', 
    '<','<=', 'in', 'not_in','between', 'not_between',
    'is_null', 'is_not_null'
]

//for sorting params
let orderby_type = ['asc', 'desc'] //do not change
let sortDisplayName = {'asc': 'Ascending', 'desc': 'Descending'}

//delimiter by regex string. value is passed to javascript split methods.
//takes a string or regex expression.
let delimiter_typeName = { '/\s+/':'Any Space', //any is space or newline
    '\n': 'New Line', '/ +/': 'Space', ',': "Comma", 
    ';':"SemiColon"}
let defaultDelimiter = '/\s+/'
//gets converted to \;\

//max filter payload?


function ReturnAlias(operator_name) {
    if (operatorAlias.hasOwnProperty(operator_name) ) {
        return operatorAlias[operator_name]
    }
    return operator_name
}

function ReturnDataClass(data_type_name) {
    //gets data class type from data_type
    if (data_types.hasOwnProperty(data_type_name)) {
        return data_types[data_type_name]
    }
    return data_classes[0]
}

//for filters returns default filter type
function DefaultOperator(data_type_name) {
    let class_name = ReturnDataClass(data_type_name)
    if (class_name === 'text') {return 'ilike'}
    else {return '='}
}

module.exports = {
    'meta_column_name': meta_column_name,
    'meta_delete_undo_name': meta_delete_undo_name,
    'page_size': page_size,
    'write_batch_size': write_batch_size,
    'valid_operators': valid_operators,
    'operatorAlias': operatorAlias,
    'array_parse_types': array_parse_types,
    'between_parse_types': between_parse_types,
    'null_parse_types': null_parse_types,
    'like_in': like_in,
    'data_classes': data_classes,
    'data_types': data_types,
    'date_operators': date_operators,
    'text_operators': text_operators,
    'number_operators': number_operators,
    'orderby_type': orderby_type,
    'sortDisplayName': sortDisplayName,
    'delimiter_typeName': delimiter_typeName,
    'defaultDelimiter': defaultDelimiter,
    'ReturnAlias': ReturnAlias,
    'ReturnDataClass': ReturnDataClass,
    'DefaultOperator': DefaultOperator
}