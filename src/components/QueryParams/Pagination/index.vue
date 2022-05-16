<!--
This module allows the user to update the offset and limit values for a given query. The information is stored in the pagination object.

This information is transfered to get_route_params on RunQuery. When the user presses next page funcitons the data in get_route_params is
altered, pagination object can only be modified by the user.

page size only?
-->
<template>
    <modal style="border: 1px solid black;"
      name="page-modal"
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
        <div class="window-header window-style">Pagination
          <span @click="closeModal()" style="float: right; color: white; padding-right: 5px;" >&times;</span>
          <span @click="toggleHelp()" style="float: right; padding-right: 2px;" v-bind:class="{helpClass: true, helpActiveClass: params.help_active}">&#63;</span>
        </div>
        <!-- <div style="margin-left: 15px;"> -->

        <div v-if="params.help_active" style="border-bottom: 2px dotted; max-width: 100%; word-wrap: break-word; margin-bottom: 8px;">
          <div style="margin-left: 5px; padding-bottom: 5px;">
              <h4 style="display: inline;" >Pagination Help:</h4>
              <p style="display: inline; font-size: 13px;">
                s a method of dividing web content into discrete pages
                The sort module is used to determine what order to retrieve the server side data. Each row condition has two
                parameters. The data variable to sort by and what order to sort it in i.e. ascending or descending.
                To close window click x in top right or click outside the box.<br>
                add: Creates a new condition to sort by.<br>
                delete: Delete the last condition<br>
                clear: Clears all sort conditions
              </p>
          </div>
        </div>



        <div  style="width: 100%; max-height: 85%; overflow-y: auto; 1px solid black; margin-top: 5px; padding-left: 20px;">

            <p >Pagination Input</p>
              <label for="limit">Limit:&nbsp;&nbsp;</label>
              <input type="number" id="limit" name="limit" v-model="pagination.limit"><br>
              <p v-if="limitError" style="color: red;">Limit must be an integer between 10 and 5000. Will default to 1000 on error</p>
              <br>
              <!-- show error must not be empty? must be numeric. must be between 10 and 5000. Default 1k -->
              <label for="offset">Offset:</label>
              <input type="number" id="offset" name="offset" v-model="pagination.offset"><br>
              <p v-if="offsetError" style="color: red;">Offset must be a integer greater or equal to 0. Will default to 0 on error</p>
              <br>
              <!-- show error must not be empty? must be numeric. must be between 10 and 5000. Default 1k -->

        </div>
        <!-- </div> -->
    </div>
    <!-- <div> HI </div> -->
  </modal>
</template>
<script>
export default {
  name: 'Page_Modal',
  props: {
    params: {
      // required: true,
      default: function () {return {'help_active': true} },
      type: Object
    },
    pagination: {
      // required: true,
      default: function () {return {} },
      type: Object
    },

  },



  // data () {
  //   return {
  //    helpActive: false,
  //    limit: 1000,
  //    offset: 0,
  //   }
  // },
  computed: {
    limitError() {
      if(this.pagination.limit === "") {return true}
      var lx = Number(this.pagination.limit)
      if (isNaN(lx)) {
        return true
      } else if (lx < 10) {
        return true
      } else if (lx > 5000) {
        return true
      } else {
        return false
      }

    },
    offsetError() {
      if(this.pagination.offset === "") {return true}
      var ofx = Number(this.pagination.offset)
      if (isNaN(ofx) ) {
        return true
      } else if (ofx < 0) {
        return true
      } else {
        return false
      }
    }
  },


  methods: {
    toggleHelp() {
      this.params.help_active = !this.params.help_active
    },
    closeModal() {
        this.$modal.hide('page-modal')
    },

      beforeOpen() {},
      beforeClose() {
        this.limit = parseInt(this.limit)
        this.offset = parseInt(this.offset)
        if (this.limitError) {this.limit = 1000}
        if (this.offsetError) {this.offset = 0}
      }
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