/**
 * @jest-environment jsdom
 */

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

//newFilterList
test('displays list', () => {
  // mount() returns a wrapped Vue component we can interact with
  let filterParams = InitData()
  const fx = mount( FilterComponent, {
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
  expect(fx.vm.DisplayList).toMatchObject(res)
})

test('operator list', () => {
    // mount() returns a wrapped Vue component we can interact with
    let filterParams = InitData()
    const fx = mount( FilterComponent, {
      propsData: {
          filterList:    filterParams.filterList,
          newFilterList: filterParams.new
      }
    })
    let t = fx.vm.OperatorsList('text').length === 10
    let f = fx.vm.OperatorsList('float').length === 12
    let b =  fx.vm.OperatorsList('boolean').length === 4
    expect(t && f && b).toBe(true)
})

test('input field params', () => {
    // mount() returns a wrapped Vue component we can interact with
    let filterParams = InitData()
    const fx = mount( FilterComponent, {
      propsData: {
          filterList:    filterParams.filterList,
          newFilterList: filterParams.new
      }
    })
    let t =  fx.vm.InputFieldParams('text', 'ilike')
    let f =  fx.vm.InputFieldParams('float', 'in')
    let b =  fx.vm.InputFieldParams('boolean', '=')
    let res = {'text': t, 'float': f, 'bool': b}    
    let exp = {
        'text':{
            htmlInput: 'input',
            dataClass: 'text',
            show_delimiter: false,
            dataType: 'text'
        }, 
        'float': {
            htmlInput: 'area',
            dataClass: 'number',
            show_delimiter: true,
            dataType: 'float'
        },
        'bool': {
            htmlInput: 'selector',
            dataClass: 'boolean',
            show_delimiter: false,
            dataType: 'boolean'
        }
    }
    expect(res).toMatchObject(exp)
})


test('add row', () => {
    // mount() returns a wrapped Vue component we can interact with
    let filterParams = InitData()
    const fx = mount( FilterComponent, {
      propsData: {
          filterList:    filterParams.filterList,
          newFilterList: filterParams.new
      }
    })
    fx.vm.AddRow(1)
    let res = [
        {
          value: 'Y',
          delimiterType: '/s+/',
          column_name: 'b',
          operator: '=',
          value2: null,
          dataType: 'text',
          headerName: 'B'
        },
        {
          headerName: 'A',
          column_name: 'a',
          delimiterType: '/s+/',
          operator: 'ilike',
          value: null,
          value2: null,
          dataType: 'text'
        }
    ]
    expect(res).toMatchObject(fx.vm.newFilterList)
})

test('clear rows', () => {
    //removes all filters
    let filterParams = InitData()
    const fx = mount( FilterComponent, {
      propsData: {
          filterList:    filterParams.filterList,
          newFilterList: filterParams.new
      }
    })
    fx.vm.AddRow(1)
    let t1 = fx.vm.newFilterList.length === 2
    fx.vm.ClearRows()
    let t2 = fx.vm.newFilterList.length === 0
    expect(t1 && t2).toBe(true)
})

test('clear value', () => {
    //sets all values to null
    let filterParams = InitData()
    const fx = mount( FilterComponent, {
      propsData: {
          filterList:    filterParams.filterList,
          newFilterList: filterParams.new
      }
    })
    fx.vm.ClearValue(0)
    let t1 = fx.vm.newFilterList[0]['value']  === null
    let t2 = fx.vm.newFilterList[0]['value2'] === null
    expect(t1 && t2).toBe(true)
})

test('delete row', () => {
    //sets all values to null
    let filterParams = InitData()
    const fx = mount( FilterComponent, {
      propsData: {
          filterList:    filterParams.filterList,
          newFilterList: filterParams.new
      }
    })
    fx.vm.DeleteRow(0)
    let t1 = fx.vm.newFilterList.length  === 0
    expect(t1).toBe(true)
})