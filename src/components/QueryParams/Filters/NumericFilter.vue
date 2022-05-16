<!--
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
        <div  class="containerClass">
          <h4 v-bind:class="{bottomBorder: filter_data.filter_show }" class="headerClass"> {{filter_data.variable_name}}
            <input type="checkbox" id="hide" name="hide" v-model="filter_data.filter_show" class="hideFilterClass">
            <span v-if="filter_data.filter_show" @click="toggleHelp()" style="float: right;" v-bind:class="{helpClass: true, helpActiveClass: filter_data.help_active}">&#63;</span>
          </h4>

            <template v-if="filter_data.filter_show">

            <!-- <form style="margin-bottom: 5px; margin-top: 5px;"> -->
            <div style="padding-bottom: 5px; text-align: center;">
                <label for="numerical_compare">select filter type:</label>
                <select name="numerical_compare" v-model="filter_data.query_type" style=" padding: 0px;" @change="clearValues($event)">
                    <option value="" disabled selected hidden>Select Filter</option>
                    <option value="equals">Equals</option>
                    <option value="greater">Greater</option>
                    <option value="less">Less</option>
                    <option value="greater_equal">Greater or Equal</option>
                    <option value="less_equal">Less or Equal</option>
                    <option value="between">Between</option>
                    <option value="not_between">Not Between</option>
                    <option v-if="isInteger()" value="in">In</option>
                </select>
            </div>
            <!-- </form> -->
            <div style="text-align: center;">

            <template v-if="isQueryType('equals')">
                <label for="equals">{{filter_data.variable_name}} = </label>
                <input type="number" id="equals" name="equals" v-model="filter_data.value.value_1">

            </template>

            <template v-else-if="isQueryType('between')">
                <input type="number" id="between_1" name="between_1" style="display: inline-block;" v-model="filter_data.value.value_1">
                <p style="display: inline-block;"> &le; {{filter_data.variable_name}} &le;  </p>
                <input type="number" id="between_2" name="between_2" style="display: inline-block;" v-model="filter_data.value.value_2">

            </template>

            <template v-else-if="isQueryType('not_between')">
                <label for="between_1">{{filter_data.variable_name}} &le; </label>
                <input type="number" id="between_1" name="between_1" style="display: inline-block;" v-model="filter_data.value.value_1">
                <p style="display: inline-block;"> or  </p>
                <label for="between_2">{{filter_data.variable_name}} &ge; </label>
                <input type="number" id="between_2" name="between_2" style="display: inline-block;" v-model="filter_data.value.value_2">
            </template>

            <template v-else-if="isQueryType('greater')">
                <label for="greater">{{filter_data.variable_name}} &gt; </label>
                <input type="number" id="greater" name="greater" style="display: inline-block;" v-model="filter_data.value.value_1">
            </template>

            <template v-else-if="isQueryType('less')">
                <label for="less">{{filter_data.variable_name}} &lt; </label>
                <input type="number" id="less" name="less" style="display: inline-block;" v-model="filter_data.value.value_1">
            </template>

            <template v-else-if="isQueryType('greater_equal')">
                <label for="greater_equal">{{filter_data.variable_name}} &ge; </label>
                <input type="number" id="greater_equal" name="greater_equal" style="display: inline-block;" v-model="filter_data.value.value_1">
            </template>

            <template v-else-if="isQueryType('less_equal')">
                <label for="less_equal">{{filter_data.variable_name}} &le; </label>
                <input type="number" id="less_equal" name="less_equal" style="display: inline-block;" v-model="filter_data.value.value_1">
            </template>

            <template v-else-if="isQueryType('in')">
                <!-- Add comma separated? 
                emails.toLowerCase().split(/[\s,;\t\n]+/);
                -->
                <label for="number_list" style="display: block;">List of {{filter_data.variable_name}} delimited by: new line or space</label>
                <textarea style="display: block; margin-left: auto; margin-right: auto;" id="number_list" name="number_list" rows="4" cols="60"
                v-model="filter_data.value.value_list">
                </textarea>

            </template>
            </div>
            <!-- help -->
            <help-filter-window v-if="filter_data.help_active" :data_description="filter_data.data_describe" :filter_description="filter_description"
              :data_type="filter_data.data_type" />

            <!-- template for hiding -->
            </template>
        </div>

</template>
<script>
import HelpFilterWindow from '@/components/modal_windows/filters/help_filter_window.vue'
const bool_filter_description = "this is a description of the bool filter"

export default {
  name: 'Numeric_Filter_Entry',
  components: {HelpFilterWindow},

  props: {
    filter_data: {
      default: function () {
        return {'data_type': 'float',
        'query_type': "",
        'filter_active': true,
        'filter_show': true,
        'help_active': false,
        'data_describe': "",
        'value': { 'value_1': null, 'value_2': null, 'value_list': ""},
        'variable_name': ""
        } 
      },
      type: Object
    }

  },


  data () {
    return {
    //before, after, between or on
    //  data_type: "integer",
    //  query_type: "equals",
    //  variable_name: "test_name",
    //  value_1: null,
    //  value_2: null,
    //  value_string: null,
    //  isShow: true,
    //  helpActive: false,
     filter_description: bool_filter_description,
    }
  },

  methods: {
      isInteger() {
          if (this.filter_data.data_type === "integer") {return true}
          return false
      },
      isQueryType(entry_type) {
          if (this.filter_data.query_type === entry_type) {return true}
          return false
      },
      clearValues() {
            this.filter_data.value.value_1 = null
            this.filter_data.value.value_2 = null
            this.filter_data.value.value_list = null
      },
    toggleHelp() {
      this.filter_data.help_active = !this.filter_data.help_active
    }
      //Clear Old Data
      // add description??

  }
}
</script>

<style scoped>
@import '@/assets/filterStyle.css';

</style>