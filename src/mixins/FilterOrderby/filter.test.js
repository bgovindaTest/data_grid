/**
 * @jest-environment jsdom
 */

// Import the `mount()` method from Vue Test Utils
// import { mount } from '@vue/test-utils'
// Import the `mount()` method from Vue Test Utils
import { mount } from '@vue/test-utils'
import filterByMix from './filter.js'



// The component to test
const FilterComponent = {
    template: '<div></div>',
    mixins: [filterByMix]
}

function InitData() {
    let filterByParams = {
        'current': [
            { value: 'Y', delimiterType: null, column_name: 'b', operator: '=',
              value2: null, dataType: 'text', headerName: 'B'
            }
        ],
        'filterList': [ 
            { headerName: 'B', column_name: 'b', dataType: 'text' },
            { headerName: 'A', column_name: 'a', dataType: 'text' },
            { headerName: 'C', column_name: 'c', dataType: 'text' }, 
        ],
        'new': [
            { value: 'Y', delimiterType: null, column_name: 'b', operator: '=',
              value2: null, dataType: 'text', headerName: 'B'
            }
        ],
        'enforcedFilters':  
        [
            {
              value: 'X',
              delimiterType: null,
              column_name: 'a',
              operator: '=',
              value2: null,
              dataType: 'text',
              headerName: 'A'
            }
          ]
    }
    return filterByParams
}

// newFilterList
test('displays list', () => {
  // mount() returns a wrapped Vue component we can interact with
  let filterParams = InitData()
  const ox = mount( FilterComponent, {
    propsData: {
        filterList:    filterParams.filterList,
        newFilterList: filterParams.new
    }
  })

  let res = [
    { headerName: 'A', column_name: 'a', dataType: 'text', 'index': 0 },
    { headerName: 'B', column_name: 'b', dataType: 'text', 'index': 1 },
    { headerName: 'C', column_name: 'c', dataType: 'text', 'index': 2 },
  ]
  expect(ox.vm.DisplayList).toMatchObject(res)
})


// methods: {
//     OperatorsList(data_type) {
//         let data_class = ReturnDataClass(data_type)
//         // /['text', 'number', 'date', 'array', 'object','boolean']
//         if (data_class==='number')       { return this.NumberOperators }
//         else if (data_class==='date')    { return this.DateOperators }
//         else if (data_class==='boolean') { return this.BooleanOperators }
//         //add options for other types later
//         else { return this.TextOperators }
//     },
//     InputFieldParams(data_type, operator) {
//         /*
//         Which input type to display single box. text area boolean drop down
//         etc. Controls widgets in filter bar.

//         */
//         let htmlInput  = 'input'
//         let data_class = ReturnDataClass(data_type)
//         let show_delimiter = false
//         if (data_config.boolean_types.includes(data_type)) {htmlInput = 'selector'}
//         if (array_parse_types.includes(operator)) {
//             htmlInput  = 'area'
//             show_delimiter = true
//         }
//         else if (null_parse_types.includes(operator))   {htmlInput  = 'null'}  
//         else if (between_parse_type.includes(operator)) {htmlInput  = 'two_input'}
//         else { htmlInput  = 'input' }
//         let params = {'htmlInput': htmlInput, 'dataClass': data_class,
//             'show_delimiter': show_delimiter, 'dataType': data_type}
//         return params
//     },
//     AddRow(index) {
//         let filter_row = this.filterList[index]
//         let delimiterType = ReturnDelimiterType( filter_row['dataType'] || null )
//         let ox = DefaultOperator(filter_row['dataType'] || 'text')

//         this.newFilterList.push(
//             {'headerName': filter_row['headerName'], 'column_name': filter_row['column_name'], 
//                 'delimiterType': delimiterType, 'operator': ox, 'value': null,
//                 'value2': null 
//             }
//         )
//     },
//     ClearRows() {
//         //remove all filters
//         this.newFilterList.length = 0
//     },
//     ClearValue(index) {
//         //resets values
//         let fx = this.newFilterList[index]
//         fx['value']  = null
//         fx['value2'] = null
//     },
//     DeleteRow(index) {
//         //removes object from array at the given position
//         if (this.newFilterList.length <= 0 ) { return  }
//         else if (index < 0 || index > this.newFilterList.length) {}
//         else { this.newFilterList.splice(index, 1) }
//     },
// }