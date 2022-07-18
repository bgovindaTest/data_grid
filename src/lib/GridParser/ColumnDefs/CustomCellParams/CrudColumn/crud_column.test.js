/*
test crud column
*/

const CrudColumnInit = require('./crud_column')

test('crud column import test', () => {
    let grid = []
    CrudColumnInit(grid)
    let grid_column = grid[0]
    let res = {
        showSort: false,
        showFilter: false,
        allowAction: true,
        headerName: 'GridAction',
        cellEditorParams:     {
            allowDelete: { update: true, insert: false },
            allowUndo: { update: true, insert: true },
            allowCopy: { update: true, insert: true }
          }
    }
    expect(grid_column).toMatchObject(res)
})