# Explain layout

# DataConfig

# TypeCheck

# GridParser

## Expression Parser

## IsCrudParams


## ColumnDefs



```javascript
/*
Parses grids json object and converts expression syntax into javascript functions. 

    'qparams_prefix':"",
    'url_prefix':"",
    '__init_params__':  {},
    '__url_params__': {},
    '__drop_downs__': {},
    '__valuesObject__': [{}] //array is grid position object key is field and value is values to be passed.
    '__is_read_only__':  true/false (do the have modification permssions)
        //if no force editable to false

    //first grid is main. others can be called as subgrids
    grids: [
        {'name': 'x'
        'headerParams': {
            links: [{'name': xxx, 'url': xxx }],
            help: "",
            addRow: true
        }
        'crudParams': //i.e. new row, update, delete, etc read/etc create default objects for query params?
            { 
                default: ->
                select:  ->
                insert:  -> //string or {'route': 'string', 'doInstead': 'update', 'crudParams': {}}
                update:  ->
                delete:  ->
                upsert_set: [] //for upsert only sent in set object in payload
                set_filter: [] //for update will just filter things out from data object
                default_fields: {}
                on_constraint: ''
                on_conflict: ''
                deleteWarning: ''
            }

        'columnDef': //agrid info
        },
        {'name': 'y'
        'crudParams': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
    ]


gridOptions.suppressPropertyNamesCheck = true

validator: function()

alias: {'pull': 'push'} //defaults to field

//remove valueSetter if readonly?

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
requiredFieldsTypeCheck: true //unchangeage
nullReplace: true
 
isCrud:   true/false maybe read/write/? r rw w converted to object
editable: true/false {'update': true/false, 'insert': true/false}
deleteWarning: string (determines if delete should happen)
isFlag: for submit buttons or other functionality not meant to be sent to server.
    data is editable but doesnt get sent to the server. flags do allow the 
    row to be registered as a change.

dataType:  //used for sorting? need to add time and datetime filters

allowNull: true/false
isRequired: true/false
ignoreError: true/false (for calculated fields?) allow to pass or skip?
typeCheckError? if true dont remove invalid data type.
    //show as error instead?. dont run validation if error. not implemented yet would
    //also have to add for xyz

//returnOnIgnoreError: true/false if true use default otherwise

ifNull: 'psql string calls to replace value'
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""

//need to add parameters to defaultValue and defaultFilter to deal with sub modal cases
//field determines which data to get from params.data in aggrid. key is if its an object.
defaultValue: {'value': 'string', 'type': '', 'key': '', 'field': '' } handle raw value or replacement from row params?
defaultOrderby: 'asc/desc' (done by column order in columnDefs)
defaultFitler: string value

showFilter: default true (if false cant be changed) should hide from filter module
showSort: default true (if false cant be used for sorting)

Responsible for creating valueGetter, valueSetter and valueFormatter
default is expression syntax string.
if object options are {'string': string_value}, {'function': js_function} {'expression': expression string}

NativeFields: fields are not parsed. taken as is and passed to aggrid directly
    i.e. valueGetter = valueGetterNative
    valueGetterNative: 
    valueSetterNative: (optional) (grid_rules_object). Need to add for date column?
    valueFormatterNative: blah
    toolTipNative: expression for variables

hide - hides the field
suppressToolPanel - removes it from the tool panel.

pageParams (rowPrams: for subgrid)\
    row_params: (available for subgrid )
    globals:
    url_params:

primaryKey: 'default id'
*/
```