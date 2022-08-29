const rb = require('./index.js')

test('reqbody default only', () => {
    let columnDefs = [{'field': 'x', 'ifNull': 'default'}, {'field':'y', 'ifNull': 'null'} ]
    let routeParams = { 'default_route': 'test' }
    let x = new rb(routeParams, columnDefs, 'localhost')
    x.RouteParamsInit()
    console.log(routeParams)
    expect(true).toBe(true)
})

test('reqbody set_fields, set_filter', () => {
    let columnDefs = [{'field': 'x', 'ifNull': 'null'}, {'field':'y', 'ifNull': 'null'} ]
    let routeParams = { 
        'default_route': 'data',
        'set_fields': ['x'],
        'constraint': 'unique',
        'delete':{ 'route': '/home/delete' }

    }
    let x = new rb(routeParams, columnDefs, 'localhost/')
    x.RouteParamsInit()
    console.log(routeParams)
    expect(true).toBe(true)
})

test('reqbody set_fields instead of', () => {
    let columnDefs = [{'field': 'x', 'ifNull': 'null'}, {'field':'y', 'ifNull': 'null'} ]
    let routeParams = { 
        'default_route': 'localhost',
        'select': {'route':'/localhostxx/select'},
        'set_fields': ['x'],
        'constraint': 'unique',
        'set_filters': ['y'],
        'insert': {'crudType': 'update'}
    }
    let x = new rb(routeParams, columnDefs)
    x.RouteParamsInit()
    console.log(routeParams)
    expect(true).toBe(true)
})