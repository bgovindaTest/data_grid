<template>
    <div>
        <input type="checkbox" id="checkbox" v-model="params.select_column" style="margin-left: 10px;">
        <label for="checkbox">Select Columns To Filter By</label>

        <div v-if="params.select_column"> 
            <!-- Need to set deactive here and only display filters below with use_filter true? -->
            <!-- use the data.use_filter as v-model -->
            <div v-for="(filtersx, index ) in filters_list" :key="index" style="display: inline-block; margin-left: 20px;">
            <input type="checkbox" :id="index" v-model="filtersx.filter_active">
            <label :for="index">{{ filtersx.variable_name }}</label> 
            </div>

        </div>
    </div>
</template>

<script>

export default {
  name: 'Filter_Select',
//   props: ['title', filters_list],
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
  }

}
</script>