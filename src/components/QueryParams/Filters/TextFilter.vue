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
                <label for="string_compare">select filter type:</label>
                <select name="string_compare" v-model="filter_data.query_type" style=" padding: 0px;" @change="clearValues($event)">
                    <option value="" disabled selected hidden>Select Filter</option>
                    <option value="equals">Equals</option>
                    <option value="in">In</option>
                    <option value="not_in">Not In</option>
                </select>
            </div>
            <!-- </form> -->
            <div style="text-align: center;">

            <template v-if="isQueryType('equals')">
                <div style="margin-bottom: 10px;">
                    <label for="equals">{{filter_data.variable_name}} = </label>
                    <input type="text" id="equals" name="equals" v-model="filter_data.value">
                </div>
            </template>

            <template v-if="isQueryType('in')">
                <div >
                    <label for="string_list">List of {{filter_data.variable_name}} 
                        delimited by: <span v-if="filter_data.isComma"> comma </span>
                        <span v-else> new line or space </span>
                    </label>
                    <input type="checkbox" id="isComma" name="isComma" v-model="filter_data.isComma">
                    <label for="isComma">Comma Delimited</label>

                </div>
                <textarea style="display: block; margin-left: auto; margin-right: auto; margin-bottom: 10px;" id="string_list" 
                    name="string_list" rows="4" cols="60"
                    v-model="filter_data.value">
                </textarea>
            </template>

            <template v-if="isQueryType('not_in')">
                <div >
                    <label for="string_list">List of {{filter_data.variable_name}} 
                        delimited by: <span v-if="filter_data.isComma"> comma </span>
                        <span v-else> new line or space </span>
                    </label>
                    <input type="checkbox" id="isComma" name="isComma" v-model="filter_data.isComma">
                    <label for="isComma">Comma Delimited</label>

                </div>
                <textarea style="display: block; margin-left: auto; margin-right: auto; margin-bottom: 10px;" id="string_list" 
                    name="string_list" rows="4" cols="60"
                    v-model="filter_data.value">
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
const bool_filter_description = "this is a description of the string filter"

export default {
  name: 'String_Filter_Entry',
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
        'value': { 'before_date': null, 'after_date': null},
        'variable_name': ""
        } 
      },
      type: Object
    }
  },

  data () {
    return {
    //before, after, between or on
    //  data_type: "string",
    //  query_type: "equals",
    //  variable_name: "test_string",
    //  value: null,
    //  isComma: false,
    //  isShow: true,
    //  helpActive: false,
     filter_description: bool_filter_description,

    }
  },

  methods: {
      isQueryType(entry_type) {
          if (this.filter_data.query_type === entry_type) {return true}
          return false
      },
      clearValues() {
            this.filter_data.value = ""
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
