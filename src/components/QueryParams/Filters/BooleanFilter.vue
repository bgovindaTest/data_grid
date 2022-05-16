<!--
This is the vue script for the popup window that is displayed to prevent a user from
editing/adding to multiple components.

imported from paramsModal
in, equals , greater_equal, greater, less, less_equal, between, not_between

Add border ?
props:
variable_name
value
data_type
query_type

-->
<template>

        <div  class="containerClass">
          <h4 v-bind:class="{bottomBorder: filter_data.filter_show }" class="headerClass"> {{filter_data.variable_name}}
            <input type="checkbox" id="hide" name="hide" v-model="filter_data.filter_show" class="hideFilterClass">
            <span v-if="filter_data.filter_show" @click="toggleHelp()" style="float: right;" v-bind:class="{helpClass: true, helpActiveClass: filter_data.help_active}">&#63;</span>
          </h4>
            <template v-if="filter_data.filter_show">


            <div class="boolInputContainer">
                <div>
                    <input type="checkbox" id="allowX" name="allowX" v-model="filter_data.value">
                    <label for="allowX">{{filter_data.variable_name}}</label>
                </div>

            </div>

            <help-filter-window v-if="filter_data.help_active" :data_description="filter_data.data_describe" :filter_description="filter_description"
              :data_type="filter_data.data_type" />

            </template>
        </div>
</template>
<script>
import HelpFilterWindow from '@/components/modal_windows/filters/help_filter_window.vue'
const bool_filter_description = "this is a description of the bool filter"

export default {
  components: {HelpFilterWindow},
  name: 'Bool_Filter_Entry',
  props: {
    filter_data: {
      default: function () {
        return {'data_type': 'boolean',
        'query_type': "",
        'filter_active': true,
        'filter_show': true,
        'help_active': false,
        'value': false,
        'data_describe': "",
        'variable_name': ""
        } 
      },
      type: Object
    }

  },


  data () {
    return {
    //before, after, between or on
    //add description? on hover?
    //  data_type: "boolean",
    //  query_type: "equals",
    //  variable_name: "test_date",
    //  value: false,
    //  isShow: true,
    //  helpActive: false,
     filter_description: bool_filter_description,
     //css ctyle
    }
  },

  methods: {
    toggleHelp() {
      this.filter_data.help_active = !this.filter_data.help_active
    }

  }
}
</script>

<style scoped>
@import '@/assets/filterStyle.css';

</style>
