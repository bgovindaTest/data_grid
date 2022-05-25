<template>
<div >

    <SearchAutocomplete
      :items="[
        'Apple',
        'Banana',
        'Orange',
        'Mango',
        'Pear',
        'Peach',
        'Grape',
        'Tangerine',
        'Pineapple'
      ]"
    />
  <!-- <div id="app">
    <button @click="gotoGoogle()">Google</button>
  </div> -->

</div>
</template>

<script>


import SearchAutocomplete from './components/SearchAutocomplete.vue'


export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods: {
    gotoGoogle() {
      window.open("https://www.google.com");
    },
  },

  components: {
    SearchAutocomplete
  }
}
</script>

