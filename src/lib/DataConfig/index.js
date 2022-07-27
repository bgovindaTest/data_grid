/*
//stores dataTypes and filter operators and alias
main default configuration file
*/

//name of special columns
const meta_column_name = '_ag-meta_'
const meta_crud_type = 'crudType'
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

let cellEditors = {
    //customEditors have special formatting
    //crudSelector is for metacolumn params, delete, undo and add?
    'customEditors':    ['autoCompleteEditor', 'crudSelectEditor', 'subGridSelectorEditor', 'agRichSelectCellEditor'],
    'standardEditors' : ['agTextCellEditor', 'agLargeTextCellEditor', 'dateTimeEditor' ], //make popupTrue for agLargeTextCellEditor
    'defaultEditor': 'agTextCellEditor',
    //data is in an object instead of a base value
    'lookupEditors': ['autoCompleteEditor', 'agRichSelectCellEditor']
}



//determine if string should be split into an array
let array_parse_types  = ['like_in', 'not_like_in', 'ilike_in', 'not_ilike_in', 'in', 'not_in' ]
//determine if values should be stored as array length 2. for between not_between
let between_parse_types  = ['between', 'not_between']
let null_parse_types = ['is_null', 'is_not_null']

let data_classes = ['text', 'number', 'date', 'array', 'object','boolean']
let c = data_classes
//data_types and filter class
//lookups

let number_default  = '0'
let text_default    = ''
let date_default    = ''
let boolean_default = 'false'

//numbers
let number_types = ['smallint', 'integer', 'int', 'bigint', 'decimal', 'numeric',
    'real', 'double precision', 'money', 'numeric', 'float']
let integer_types = ['smallint', 'integer', 'int', 'bigint']

let serial_types = ['serial', 'bigseral'] //should be integers
let text_types   = ['text', 'character', 'char', 'varchar']
let date_types   = ['date', 'datetime', 'time', 'timestamp', 'timestampz']
let object_types = ['array', 'object']
let boolean_types   = ['bool', 'boolean']

let data_types = {} //data type class
let null_conversion = {} //convert null to value based on data type
for(let i = 0; i<number_types.length; i++) { 
    data_types[number_types[i]] = c[1]
    null_conversion[number_types[i]] = number_default
}
for(let i = 0; i<text_types.length; i++) { 
    data_types[text_types[i]] = c[0]
    null_conversion[text_types[i]] = text_default
}

for(let i = 0; i<serial_types.length; i++) { 
    data_types[serial_types[i]] = c[1]
    null_conversion[serial_types[i]] = number_default
}

for(let i = 0; i<date_types.length; i++) { 
    data_types[date_types[i]] = c[2]
    null_conversion[date_types[i]] = date_default
}

for(let i = 0; i<boolean_types.length; i++) { 
    data_types[boolean_types[i]] = c[5]
    null_conversion[date_types[i]] = boolean_default
}



data_types['json'] = c[4]
data_types['object'] = c[4]
data_types['array'] = c[3]

null_conversion['array'] = []
null_conversion['json']  = {}
null_conversion['object']  = {}



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

let boolean_operators = ['=','!=', 'is_null', 'is_not_null']

//for sorting params
let orderby_type = ['asc', 'desc'] //do not change
let sortDisplayName = {'asc': 'Ascending', 'desc': 'Descending'}

//delimiter by regex string. value is passed to javascript split methods.
//takes a string or regex expression.
let delimiter_typeName = { '\s+':'Any Space', //any is space or newline
    '\n': 'New Line', ' +': 'Space', ',': "Comma", 
    ';':"SemiColon"}

let defaultDelimiter = '\s+'
//string conversion for delimiter type doesnt always work
//regExMap is quickfix because delimiter_typeName keys dont always
//work in split function for string when input is a regex string i.e. \s+ doesnt work
//but \n does
let regExMap  = {
    '\s+': /\s+/, //any is space or newline
    '\n': '\n', ' +': ' +',',': ",", 
    ';': ';'}
//gets converted to \;\

//postgres commands to replace null values
let if_null_types = [
    /*
    These are default values that can be direclty entered into crud operations. These
    */
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""
]

function ReturnDelimiterType(delimiterType) {
    if (delimiter_typeName.hasOwnProperty(delimiterType)) {
        return delimiterType
    }
    if (delimiterType === null) { return defaultDelimiter }
    else { return defaultDelimiter}
}

//max filter payload?


function ReturnOperatorAlias(operator_name) {
    if (operatorAlias.hasOwnProperty(operator_name) ) {
        return operatorAlias[operator_name]
    } else {
        console.error(`Invalid operator name ${operator_name}`)
        return operator_name
    }
}

function ReturnDataClass(data_type_name) {
    //gets data class type from data_type
    if (data_types.hasOwnProperty(data_type_name)) {
        return data_types[data_type_name]
    }
    console.error(`Invalid data type for field ${data_type_name} setting to class text`)
    return data_classes[0]
}

//for filters returns default filter type
function DefaultOperator(data_type_name) {
    let class_name = ReturnDataClass(data_type_name)
    if (class_name === 'text') {return 'ilike'}
    else {return '='}
}

function GridColumnValidDtype(field, data_type) {
    //used in grid parser checks if correct data_type string
    if (data_types.hasOwnProperty(data_type) ) {return true}
    else {
        console.error(`Invalid data type for field ${field} data_type set to ${data_type}`)
        return false
    } 
}

function GridColumnValidCellEditor(field, cellEditor) {
    //used in grid parser checks if correct data_type string
    if (typeof cellEditor === 'undefined') {return true}
    else if (cellEditors['customEditors'].includes(cellEditor)) {return true}
    else if (cellEditors['standardEditors'].includes(cellEditor)) {return true}
    else {
        console.error(`Invalid cellEditor for field ${field} cellEditor set to ${cellEditor}`)
        return false
    }
}



module.exports = {
    'meta_crud_type': meta_crud_type,
    'meta_column_name': meta_column_name,
    'page_size': page_size,
    'write_batch_size': write_batch_size,
    'valid_operators': valid_operators,
    'operatorAlias': operatorAlias,
    'array_parse_types': array_parse_types,
    'between_parse_types': between_parse_types,
    'null_parse_types': null_parse_types,

    'data_classes': data_classes,
    'data_types': data_types,
    'date_operators': date_operators,
    'text_operators': text_operators,
    'number_operators': number_operators,
    'boolean_operators': boolean_operators,
    'orderby_type': orderby_type,
    'sortDisplayName': sortDisplayName,
    'delimiter_typeName': delimiter_typeName,
    'defaultDelimiter': defaultDelimiter,
    'ReturnOperatorAlias': ReturnOperatorAlias,
    'ReturnDataClass': ReturnDataClass,
    'DefaultOperator': DefaultOperator,
    'null_conversion': null_conversion,
    'GridColumnValidDtype': GridColumnValidDtype,
    'GridColumnValidCellEditor': GridColumnValidCellEditor,
    'ReturnDelimiterType': ReturnDelimiterType,

    'boolean_types': boolean_types,
    'number_types': number_types,
    'integer_types': integer_types,
    'serial_types': serial_types,
    'text_types':   text_types,
    'date_types':   date_types,
    'object_types': object_types,
    'cellEditors': cellEditors,
    'if_null_types': if_null_types,
    'regExMap': regExMap
}