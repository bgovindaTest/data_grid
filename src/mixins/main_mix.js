/*
This mix in is used in the Main.vue

It mainly calls the initialization scripts in GridPraser


*/

// define a mixin object
var myMixin = {
    data () {
        return {
            url_params: {},
            global_params: {}
        }
    },

    methods: {
    LoadInitialParams: async function () {
        console.log('hello from mixin!')
        console.log(this.rowData)
        console.log(this.axios)
      }
    }
  }

  module.exports = myMixin