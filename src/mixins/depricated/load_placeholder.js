/*
Parses grids json object and converts expression syntax into javascript functions. 
config: {
    'qparams_prefix':"",
    'url_prefix':"",
    '__init_params__':  {},
    '__url_params__': {},
    '__drop_downs__': {},
    '__is_read_only__':  true/false (do the have modification permssions)

    //first grid is main. others can be called as subgrids
    grids: [
        {'name': 'x'
         'help': ""
        'headerParams': {
            links:
            add_row: bool,
            new_sheet: bool,
            rowSelection mode: ?
            copyPaste?

        }
        'crud_params': {
            crudRoute:
                default: ->
                select:  ->
                insert:  ->
                update:  ->
                delete:  ->

            crudInsteadOf: {
                'insert': 'update'
            }
        }
        'columnDef': //agrid info
        'rowData': //
        },
        {'name': 'y'
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
    ]


}
*/

/*
Initial loader
*/

//InitialParams
//ExpressionParser
//ColumnDefs



let config = {
    qparamsPrefix:"",
    urlPrefix:"",
    __init_params__:  {},
    __url_params__: {},
    __drop_downs__: {},
    __is_read_only__:  false,

    //first grid is main. others can be called as subgrids
    page: [
        {
        name: 'main',
        help: "",
        primary_key: "id", //or array?
        headerParams: {
            links: null,
            add_row: false,
            new_sheet: false,
            rowSelectionMode: true,
            copyPaste: true
        },
        crudParams: {
            crudRoute:{
                default: "",
                select:  "",
                insert:  "",
                update:  "",
                delete:  "",
            },
            crudInsteadOf: {
                insert: 'update'
            }
        },
        columnDefs: [
            { field: "make" },
            { field: "model" },
            { field: "price", editable: true}
        ],//agrid info
        rowData: [
            { make: "Toyota", model: "Celica", price: 35000},
            { make: "Ford", model: "Mondeo", price: 32000},
            { make: "Porsche", model: "Boxster", price: 72000},
        ]
        }
    ]
}


module.exports = config