/**
 * @jest-environment jsdom
 */

// Import the `mount()` method from Vue Test Utils
// import { mount } from '@vue/test-utils'
// Import the `mount()` method from Vue Test Utils
import { mount } from '@vue/test-utils'
import orderByMix from './orderby.js'



// The component to test
const OrderByComponent = {
  template: '<p>{{ msg }}</p>',
  props: ['msg'],
  mixins: [orderByMix]
}

function InitData() {
    let orderByParams = {
        'orderByList':     [
            { headerName: 'D', column_name: 'd' },
            { headerName: 'A', column_name: 'a' },
            { headerName: 'C', column_name: 'c' },
            { headerName: 'B', column_name: 'b' }
        ],
        'current':     [
            { headerName: 'A', column_name: 'a', order_by: 'asc' },
            { headerName: 'B', column_name: 'b', order_by: 'desc' }
        ],
        'new': [
            { headerName: 'A', column_name: 'a', order_by: 'asc' },
            { headerName: 'B', column_name: 'b', order_by: 'desc' }            
        ]
    
    }
    return orderByParams
}


// orderByList: {
//     //jsonArray
//     //full list of options to orderBy
//     type: Object,
//     //required: true
// },
// newOrderByList: {



test('displays list', () => {
  // mount() returns a wrapped Vue component we can interact with
  let orderByParams = InitData()
  const ox = mount(OrderByComponent, {
    propsData: {
        orderByList: orderByParams.orderByList,
        newOrderByList: orderByParams.new
    }
  })

  let res = [
    { headerName: 'C', column_name: 'c', index: 0 },
    { headerName: 'D', column_name: 'd', index: 1 }
  ]
  expect(ox.vm.DisplayList).toMatchObject(res)
})

test('add filter', () => {
    // mount() returns a wrapped Vue component we can interact with
    let orderByParams = InitData()
    const ox = mount(OrderByComponent, {
      propsData: {
          orderByList: orderByParams.orderByList,
          newOrderByList: orderByParams.new
      }
    })
    ox.vm.AddRow(1)

    let resl =  [
        { headerName: 'A', column_name: 'a', order_by: 'asc' },
        { headerName: 'B', column_name: 'b', order_by: 'desc' },
        { headerName: 'D', column_name: 'd', order_by: 'asc' }
    ]
    let resd = [{ headerName: 'C', column_name: 'c', index: 0 }]
    let res = {'newOrderByList': resl,'displayList': resd}
    let ex = {'newOrderByList': ox.vm.newOrderByList,'displayList':  ox.vm.DisplayList}
    expect(ex).toMatchObject(res)
})

test('clear filters', () => {
    // mount() returns a wrapped Vue component we can interact with
    let orderByParams = InitData()
    const ox = mount(OrderByComponent, {
      propsData: {
          orderByList: orderByParams.orderByList,
          newOrderByList: orderByParams.new
      }
    })
    ox.vm.ClearRows()
    expect(ox.vm.newOrderByList.length === 0 && ox.vm.DisplayList.length === 4 ).toBe(true)
})

test('delete row at index', () => {
    // mount() returns a wrapped Vue component we can interact with
    let orderByParams = InitData()
    const ox = mount(OrderByComponent, {
      propsData: {
          orderByList: orderByParams.orderByList,
          newOrderByList: orderByParams.new
      }
    })
    ox.vm.DeleteRow(0)
    let res =  [ { headerName: 'B', column_name: 'b', order_by: 'desc' } ]
    expect(ox.vm.newOrderByList ).toMatchObject(res)
})