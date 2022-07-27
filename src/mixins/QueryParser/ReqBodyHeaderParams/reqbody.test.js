const rb = require('./index.js')

test('reqbody default only', () => {
    let columnDefs = [{'field': 'x', 'ifNull': 'null'}, {'field':'y', 'ifNull': 'null'} ]
    let crudParams = { 'default_route': 'localhost' }
    let x = new rb(crudParams, columnDefs)
    x.CrudParamsInit()
    console.log(crudParams)
    expect(true).toBe(true)
})

test('reqbody set_fields, set_filter', () => {
    let columnDefs = [{'field': 'x', 'ifNull': 'null'}, {'field':'y', 'ifNull': 'null'} ]
    let crudParams = { 
        'default_route': 'localhost',
        'set_fields': ['x'],
        'constraint': 'unique',
        'delete':{ 'route': '/home/delete' }

    }
    let x = new rb(crudParams, columnDefs)
    x.CrudParamsInit()
    console.log(crudParams)
    expect(true).toBe(true)
})

test('reqbody set_fields instead of', () => {
    let columnDefs = [{'field': 'x', 'ifNull': 'null'}, {'field':'y', 'ifNull': 'null'} ]
    let crudParams = { 
        'default_route': 'localhost',
        'set_fields': ['x'],
        'constraint': 'unique',
        'set_filters': ['y'],
        'insert': {'crudType': 'update'}
    }
    let x = new rb(crudParams, columnDefs)
    x.CrudParamsInit()
    console.log(crudParams)
    expect(true).toBe(true)
})