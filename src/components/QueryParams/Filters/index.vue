<!--
The main filter module handles the display and where component for the queries. The where object and where modal object are initialized by query_params.js

The values stored in where are processed and stored in get_route_params. This object is used to help create the query params for the server.
-->
<template>
    <modal style="border: 1px solid black;"
      name="where-modal"
      draggable=".window-header"
      transition="nice-modal-fade"
      :min-width="500"
      :min-height="580"
      height="580px"
      :delay="10"
      classes= "modal-style"
      :resizable="true"
      
      >
      <div style="position: relative; height: 100%;">
        <div class="window-header window-style">Query Filters

        <span @click="closeModal()" style="float: right; color: white; padding-right: 5px;" >&times;</span>
        <span @click="toggleHelp()" style="float: right; padding-right: 2px;" v-bind:class="{helpClass: true, helpActiveClass: params.help_active}">&#63;</span>
        <!-- Where to add help statement   -->
        </div>

        <div  style="width: 100%; max-height: 90%; overflow-y: auto;">

            <!-- help window with bottom border -->
            <div v-if="params.help_active" style="border-bottom: 2px dotted; max-width: 100%; word-wrap: break-word; margin-bottom: 8px;">
              <div style="margin-left: 5px; padding-bottom: 5px; padding-top: 5px;">
                  <h4 style="display: inline;" >Filter Help:</h4>
                  <p style="display: inline; font-size: 13px;">
                    The filter module is used to send parameters to the server on what data to return. The Select Columns To Filter By checkbox will
                    display the column values that will be considered during data request to the server. <br>
                    Each selected filter will display below. The checkbox to the right of the title will show or hide the filter settings.
                    The filter will be sent to the server regardless if checked or not. When checked a question mark will appear to the left which when 
                    clicked will display help information for that filter and data variable. To exit the filter module click outside the box or click
                    the x in the top right corner.
                  </p>
              </div>
            </div>
            <!-- end help window  -->

          <div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 5px; margin-bottom: 10px; ">
            <filter-select v-bind:params="params" v-bind:filters_list="filters_list" />
          </div>

          <!-- for loop for template selection?              
          loop through list of permissions. use data_type to determine which component to send data to
          use computed list to generate list of filters.  
          -->
            <div v-for="(filtersx, index ) in active_filter_list" :key="index" style="padding-top: 5px;" >
              <quick-filter v-bind:filter_data="filtersx" v-if="filtersx.data_type === 'quick_filter'" />
              <permissions-filter v-bind:filter_data="filtersx" v-if="filtersx.data_type === 'permissions'" />
              <numeric-filter v-bind:filter_data="filtersx" v-if="filtersx.data_type === 'integer' || filtersx.data_type === 'float'"  />
              <date-filter v-bind:filter_data="filtersx" v-if="filtersx.data_type === 'date'"  />
              <string-filter v-bind:filter_data="filtersx" v-if="filtersx.data_type === 'string'" />
              <bool-filter v-bind:filter_data="filtersx" v-if="filtersx.data_type === 'boolean'" />
            </div>

        </div>
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
import NumericFilter from '../filters/numeric_filter.vue'
import DateFilter from '../filters/date_filter.vue'
import StringFilter from '../filters/string_filter.vue'
import PermissionsFilter from '../filters/permissions_filter.vue'
import BoolFilter from '../filters/bool_filter.vue'
import FilterSelect from '../filters/filter_select.vue'
import QuickFilter from '../filters/quick_filter.vue'



export default {
  name: 'Where_Modal',
  components: {NumericFilter, DateFilter, StringFilter,BoolFilter, PermissionsFilter, FilterSelect, QuickFilter},

  props: {
    params: {
      // required: true,
      default: function () {return {'help_active': true, 'select_column': false} },
      type: Object
    },
    filters_list: {
      // required: true,
      default: function () {return [{}] },
      type: Array
    }
  },

  computed: {
    active_filter_list: function() {
      return this.filters_list.filter( (val) => {return val.filter_active })
    }
  },

  methods: {
    toggleHelp() {
      this.params.help_active = !this.params.help_active
    },
    closeModal() {
        this.$modal.hide('where-modal')
    }

  }
}
</script>

<style>
.helpClass {
    cursor: pointer;
    margin-right: 5px; 
    margin-top: 0px;
}

.helpActiveClass {
    color: white;
}


.modal-style {
  border: 2px solid black;
  overflow-y: auto;
}

select {
  padding: 16px 20px;
  border: 2px solid black;
  border-radius: 4px;
  background-color: #f1f1f1;
}

.action_button {
  display: inline-block;
}

/* .window-style {
  background: grey;
  text-align: center;
  height: 30px;
  padding-top: 5px;
  margin-bottom: 10px;
  border-bottom: 2px solid black;
} */

.window-style {
  background: grey;
  text-align: center;
  height: 30px;
  border-bottom: 2px solid black;
}

.window-style:hover {
  cursor: pointer;
}

.margin_shift {
  margin-left: 15px;
}

</style>