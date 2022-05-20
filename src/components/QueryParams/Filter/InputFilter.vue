<!--
Generates filter input based on operator and data_type


This is the vue script for the popup window that is displayed to prevent a user from
editing/adding to multiple components.

imported from paramsModal
in, equals , greater_equal, greater, less, less_equal, between, not_between

['value']['value_list']
['value']['value_1']
['value']['value_2']

Add border ?
-->
<template>
<div>


<!-- if text area -->


<!-- else -->

  <!-- show one based on data type-->
  <!-- between show two based on data type -->









</div>

</template>
<script>

//single
//double (between/not between)
//text area

//date swap



export default {
  props: ['data_type', 'value_1', 'value_2'],
  //emit

  // data () {
  //   return {
  //   }
  // },
  computed: {
      isNumber() {
          return this.data_type in ['integer', 'float', 'real', 
            'number', 'decimal', 'numeric', 'smallint','bigint',
            'double precision', 'serial', 'bigserial', 'smallserial'
            ]
      },
      isText() { return this.data_type in ['character', 'varying', 'varchar', 'char', 'text'] },
      isDate() { return this.data_type === 'date' },
      isDateTime() {return this.data_type === 'timestamp'},
      isTime() {return this.data_type === 'time'},
      isInterval() {return this.data_type === 'interval'},
      isBoolean() {return this.data_type === 'bool' || this.data_type === 'boolean'},
      isTimeUnit() { return this.isDate||this.isDateTime || this.isInterval }
  },


  methods: {

  

  }
}
</script>

<style scoped>
@import '@/assets/filterStyle.css';

</style>