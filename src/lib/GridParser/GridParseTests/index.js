/*
This modules tests grid parser correctly assemgles the data into
final json object for UI configurations

Test grid for testing purposes.

*/

// '__init_params__':  {},
// '__url_params__': {},
// '__drop_downs__': {},
// '__is_read_only__':  true/false (do the have modification permssions)
//     //if no force editable to false

// //first grid is main. others can be called as subgrids
// grids: [
//     {'name': 'x'
//     'headerParams': {
//         links: [{'name': xxx, 'url': xxx }],
//         help: "",
//         addRow: true
//     }
//     'crudParams': //i.e. new row, update, delete, etc read/etc create default objects for query params?
//         { 
//             default: ->
//             select:  ->
//             insert:  -> //string or {'route': 'string', 'doInstead': 'update', 'crudParams': {}}
//             update:  ->
//             delete:  ->
//             upsert_set: [] //for upsert only sent in set object in payload
//             set_filter: [] //for update will just filter things out from data object
//             default_fields: {}
//             on_constraint: ''
//             on_conflict: ''
//             deleteWarning: ''
//         }

//     'columnDef': //agrid info
//     },
//     {'name': 'y'
//     'crudParams': //i.e. new row, update, delete, etc read/etc
//     'columnDef': //agrid info
//     },
// ]