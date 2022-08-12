<template>
    <div id="snackbar" :style="{visibility: snackBarVisible}" >
        <div class="notification is-success is-inline-block mr-2">
            <button class="delete" @click="HideSnackBar()"></button>
            {{saved}} rows saved
        </div>
        <div v-if="rejected > 0" class="notification is-danger  is-inline-block">
            <button class="delete" @click="HideSnackBar()"></button>
            {{rejected}} rows rejected
        </div>
    </div>
</template>

<script>


export default {
    props: {
        snackBarVisible: {
            type: String,
            default: 'visible' //set to hidden to close
        },
        saved: { //number rows saved by server
            type: Number,
            default: 0
        },
        rejected: { //number of rows rejected by server
            type: Number,
            default: 0
        },
    },


    methods: {
        HideSnackBar() { this.$emit('hide-snackbar') },
        ShowSnackBar() { this.$emit('show-snackbar') }
    }
 



}
//success visible
//error visible

    // <div>

    //     <div id="snackbar" :style="{visibility: isVisible}" class="notification is-success">yay</div>
    //     <div id="snackbar" :style="{visibility: isVisible}" class="notification is-danger">nay</div>
    // </div>


// #snackbar {
//   min-width: 250px;
//   margin-left: -125px;
//   background-color: #333;
//   color: #fff;
//   text-align: center;
//   border-radius: 2px;
//   padding: 16px;
//   position: fixed;
//   z-index: 1;
//   left: 50%;
//   bottom: 30px;
//   font-size: 17px;
// }

</script>



<style scoped>

#snackbar {
  position: fixed;
  z-index: 1;
  left: 10%;
  bottom: 30px;
}

#snackbar.show {
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;} 
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;} 
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}



</style>