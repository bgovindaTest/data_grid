<!--
This module stores the information needed to select the order at which rows will be returned from the server. 

The possible column fields are stored in the columnSortNames array. The user selected values are stored in the
order_by object. This information is parsed by get_route_params on RunQuery.

-->
<template>
    <modal style="border: 1px solid black;"
      name="orderby-modal"
      draggable=".window-header"
      transition="nice-modal-fade"
      :min-width="400"
      :min-height="500"
      height="500px"
      :delay="10"
      classes= "modal-style"
      :resizable="true"
      @before-open="beforeOpen"
      @before-close="beforeClose">
      <div style="position: relative; height: 100%;">
        <div class="window-header window-style">Order By
          <span @click="closeModal()" style="float: right; color: white; padding-right: 5px;" >&times;</span>
          <span @click="toggleHelp()" style="float: right; padding-right: 2px;" v-bind:class="{helpClass: true, helpActiveClass: params.help_active}">&#63;</span>
        </div>
        <!-- <div style="margin-left: 15px;"> -->
        <div class="margin_shift">
          <button class="action_button" @click="add_row()">Add</button>
          <button class="action_button" @click="delete_row()">Delete</button>
          <button class="action_button" @click="clear_rows()">Clear</button>
        </div>

        <div  style="width: 100%; max-height: 85%; overflow-y: auto; border-top: 1px solid black; margin-top: 5px;">

            <div v-if="params.help_active" style="border-bottom: 2px dotted; max-width: 100%; word-wrap: break-word; margin-bottom: 8px;">
              <div style="margin-left: 5px; padding-bottom: 5px;">
                  <h4 style="display: inline;" >Sort By Help:</h4>
                  <p style="display: inline; font-size: 13px;">
                    The sort module is used to determine what order to retrieve the server side data. Each row condition has two
                    parameters. The data variable to sort by and what order to sort it in i.e. ascending or descending.
                    To close window click x in top right or click outside the box.<br>
                    add: Creates a new condition to sort by.<br>
                    delete: Delete the last condition<br>
                    clear: Clears all sort conditions
                  </p>
              </div>
            </div>



            <form v-for="(n,index) in order_by" v-bind:key="index" style="margin-bottom: 5px; margin-top: 5px;" class="margin_shift">
                  <p style="display: inline-block;">{{sort_name(index)}} </p>
                  <select v-model="order_by[index].variable_name" style="display: inline-block; width: 150px; ; padding: 0px;" class="select">
                      <option value="" disabled selected hidden>Select a Column</option>
                      <option v-for="(valx, index2) in remaining_options(index)" :key="index2" :value="valx">{{valx}}</option>
                  </select>

                  <select v-model="order_by[index].sort_order" style="display: inline-block; width: 140px; padding: 0px;" class="select">
                      <option value="" disabled selected hidden>Order By</option>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                  </select>
            </form>

        </div>
        <!-- </div> -->
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
export default {
  name: 'Orderby_Modal',
  props: {
    params: {
      // required: true,
      default: function () {return {'help_active': true} },
      type: Object
    },
    order_by: {
      // required: true,
      default: function () {return [{}] },
      type: Array
    },
    columnSortNames: {
      // required: true,
      default: function () {return [{}] },
      type: Array
    }
  },

  methods: {
    remaining_options (index) {
      var tmp = []
      var current_value = this.order_by[index].variable_name
      this.columnSortNames.forEach( (cv) => {
        var hit = false
        var i
        for (i=0; i <this.order_by.length; i++) {
          // console.log(ob)
          if (this.order_by[i].variable_name === cv) {
            hit = true
            break
          }          
        }
        if (!hit) {tmp.push(cv)}
      })
      if (current_value !== "") { tmp.push(current_value)}

      return tmp
    },


      sort_name(i) {
        if (i==0) { return 'sort by: ' }
        else {return 'then by'}
      },

      add_row() {
        if (this.order_by.length < this.columnSortNames.length) {
          this.order_by.push({'variable_name': "", "sort_order": "" })
        }
      },
      clear_rows() {
        while(this.order_by.length > 1) {
          this.order_by.pop()
        }
        this.order_by[0]['variable_name'] = ""
        this.order_by[0]['sort_order'] = ""
      },
      delete_row() {
        if (this.order_by.length > 1) {
          this.order_by.pop()
        }
        if (this.order_by.length === 1) {
          let x = this.order_by[0]
          x.variable_name = ""
          x.sort_order = ""
        }
      },
    toggleHelp() {
      this.params.help_active = !this.params.help_active
    },
    closeModal() {
        this.$modal.hide('orderby-modal')
    },

      beforeOpen() {},
      beforeClose() {}
  }
}
</script>

<style scoped>
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

.window-style {
  background: grey;
  text-align: center;
  height: 30px;
  padding-top: 5px;
  margin-bottom: 10px;
  border-bottom: 2px solid black;
}

.window-style:hover {
  cursor: pointer;
}

.margin_shift {
  margin-left: 15px;
}

</style>