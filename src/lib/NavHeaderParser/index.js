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