/*
    grids: [
    {
        navHeaderParams: {
            name: 'x'
            links: [{'name': xxx, 'url': xxx }],
            help: "",
            addRow: true,
            newSheet: false
            //functions added here that are created from columnDef value parser
        }
    }
*/

function HeaderParams(grid) {
    let headerParams  = {}
    headerParams['new_sheet'] = false
    headerParams['add_row']   = true
    headerParams['save']   = true
}


function SubGridNameFunction( rowData, subgridNameConfig ) {
    //creates function that returns subgrid name

    // row_name: { 'field': , 'paramsKey': }
    // pre_name: ''  for concatenations before name
    // post_name: '' for concatenations after name
    // subGridName: 'string' if empty assemble from pre_name + row_name + post_name

}

// HeaderParams() {
//     /*
//     Sets header params

//     */
//     let headerParams  = this.headerParams
//     headerParams['newSheet'] = false
//     headerParams['addRow']   = true
//     headerParams['save']   = true

//     let is_read_only = headerParams['isReadOnly'] || false
//     if (is_read_only) {
//         headerParams['newSheet'] = false
//         headerParams['addRow']   = false
//         headerParams['save']   = false
//     }
//     if (type_check.IsNull(this.crudParams['insert'])) { 
//         headerParams['addRow']   = false
//         headerParams['newSheet'] = false
//     }
//     if (type_check.IsNull(this.crudParams['insert']) && type_check.IsNull(this.crudParams['update'])
//         && type_check.IsNull(this.crudParams['delete'])) { headerParams['save']   = false }
// }


module.exports = HeaderParams