<template>
<div>
  <div v-if="is_error" style="padding-left: 20px; padding-top: 20px;">
    <h1>Error</h1>
    <p>{{error_msg}}</p>

  </div>
  <div class="dx" v-else>
      <svg class="spinner" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
  </div>
</div>   
</template>

<script>
//loading screen. if error occurs display error.

export default {
  props: {
    error_msg: {
      String,
      default: ""
    }
  },
  computed: {
    is_error() {
      return this.error_msg.length > 0
    }
  }

}
</script>


<style lang="scss">
.dx {
  height: 100vh;
  background-image: linear-gradient(-105deg, #009acc, #363795);
//   background-color: red;
}


// html, body {
//   height: 100%;
//   background-image: linear-gradient(-105deg, #009acc, #363795);
// }

.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;
  
  & .path {
    stroke: hsl(210, 70, 75);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
  
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>