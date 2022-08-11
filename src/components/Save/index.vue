<template>
<div>
<!-- loading validation -->
<div v-if="!validationComplete">
    <p class="saving">Validating Data <span>.</span><span>.</span><span>.</span> </p>
</div>

<!-- validation results -->
<div v-else>


    <p class="has-text-warning-dark is-size-4" v-if="ShowDeleteWarning"> {{deleteWarning}} </p>

</div>

</div>
</template>

<script>

export default {

//{'is_save': 0, 'is_warning': 0, 'is_delete': 0, 'is_empty': 0, 'is_changed': 0, 'is_error': 0}

props: {
    saveStatus: { type: Object} ,
    deleteWarning: { 
      type: String,
      default: ""
    }, 
    validationComplete: { 
        type: Boolean,
        default: true
    },
    rowSent: { type: Object }
},


computed: {
    IsSave(){},
    NoChanges() {},
    ShowDeleteWarning() {
        // let deleteCount = this.saveStatus['is_delete'] || 0
        // if (deleteCount > 0 && deleteWarning != "") {return true}
        return false
    }



},

mounted() {
    this.SaveData()
    //launch validations
    console.log(this.validationComplete)
    //display query state date

    //show rows pushed to server
},

methods: {
    SaveData()    { this.$emit('save-data') },
    FixData()     { this.$emit('fix-data')},
    Cancel()      { this.$emit('cancel')},
    RemoveLock()  { this.$emit('remove-lock')},
}

}

</script>

<style lang="scss" scoped>

.saving {
  font-size: 20px;
}

.saving span {
  font-size: 25x;
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.saving span:nth-child(2) {
  animation-delay: .2s;
}

.saving span:nth-child(3) {
  animation-delay: .4s;
}

@keyframes blink {
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
}



</style>