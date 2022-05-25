// define a mixin object
var myMixin = {
    methods: {
      grid_hello: function () {
        console.log('hello from mixin!')
        console.log(this.rowData)
        console.log(this.axios)
      }
    }
  }

  module.exports = myMixin