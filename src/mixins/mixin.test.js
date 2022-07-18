/**
 * @jest-environment jsdom
 */

// Import the `mount()` method from Vue Test Utils
// import { mount } from '@vue/test-utils'
// Import the `mount()` method from Vue Test Utils
import { mount } from '@vue/test-utils'



const mixinsx = {
  'methods': {
    hello: function () {
      return 1
    }
  }
}

// The component to test
const MessageComponent = {
  template: '<p>{{ msg }}</p>',
  props: ['msg'],
  mixins: [mixinsx]
}


test('displays message', () => {
  // mount() returns a wrapped Vue component we can interact with
  const wrapper = mount(MessageComponent, {
    propsData: {
      msg: 'Hello world'
    }
  })
  console.log(wrapper.vm.hello() )
  // console.log(wrapper.hello() )
  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Hello world')
})