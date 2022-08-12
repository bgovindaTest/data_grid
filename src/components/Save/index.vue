<template>
<div>
<!-- loading validation -->
<div v-if="isValidating">
    <p class="saving">Validating Data <span>.</span><span>.</span><span>.</span> </p>
</div>

<!-- validation complete -->

<!-- validation results -->
<div v-else>
    <div >Validating Completed</div>
    <div> {{mainMessage}} </div>
    <div class="has-text-warning-dark is-size-4" v-if="uniqueWarning != ''"> {{uniqueWarning}} </div>
    <div class="has-text-warning-dark is-size-4" v-if="deleteWarning != ''"> {{deleteWarning}} </div>
    <div v-if="isSaving">
        <p class="saving">Saving Data <span>.</span><span>.</span><span>.</span> </p>
    </div>


</div>

</div>
</template>

<script>

export default {

  props: {
      deleteWarning: { 
        type: String,
        default: ""
      },
      uniqueWarning: { 
        type: String,
        default: ""
      },
      mainMessage: {
        type: String,
        default: ""
      },
      isValidating: { 
          type: Boolean,
          default: true
      },
      isSaving: {
          type: Boolean,
          default: true
      }
  },
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