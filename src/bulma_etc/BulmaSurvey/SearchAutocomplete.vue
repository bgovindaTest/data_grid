<template>
  <div class="autocomplete">
    <input
      type="text"
      @input="onChange"
      v-model="search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @keydown.esc="onEscape"
      ref='input_box'
    />
    <ul
      id="autocomplete-results"
      v-show="isOpen"
      class="autocomplete-results"
      ref='table-body'
    >
      <li
        class="loading"
        v-if="isLoading"
      >
        Loading results...
      </li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
        ref="rows"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
    name: 'SearchAutocomplete',
    props: {
        items: {
            type: Array,
            required: false,
            default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        isLoading: true,
        arrowCounter: -1,
      };
    },
    watch: {
      items: function (value, oldValue) {
        if (value.length !== oldValue.length) {
          this.results = value;
          this.isLoading = false;
        }
      },
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    methods: {

      setResult(result) {
        this.search = result;
        this.isOpen = false;
      },
      filterResults() {
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        });
      },
     //grid search
        matches() {
            if (this.selection == "" || this.selection === null  ) {

                return this.selectValues 
            }
            else {
                var mx = String(this.selection).toLowerCase()
                var mx_array = mx.split(/[\s,]+/)
                return this.selectValues.filter((row) => {
                    var match_string = row[this.match_string]
                    var i = 0;
                    for( i in mx_array) {
                        if (match_string.indexOf(mx_array[i]) < 0) {return false}
                    }
                    return true
                });
            }

        },




      onChange() {
        this.$emit('input', this.search);

        if (this.isAsync) {
          this.isLoading = true;
        } else {
          this.filterResults();
          this.isOpen = true;
        }
      },
      handleClickOutside(event) {
        if (!this.$el.contains(event.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
        }
      },
      onArrowDown() {
        if (this.arrowCounter < this.results.length-1) {
          this.arrowCounter = this.arrowCounter + 1;
          this.fixScroll();
        }
        // this.fixScroll()
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter - 1;
          this.fixScroll();
        }
      },
      onEnter() {
        // this.resetScroll()
        this.search = this.results[this.arrowCounter];
        this.isOpen = false;
        this.arrowCounter = -1;
      },
      onEscape(event) {

        this.isOpen = false;
        this.arrowCounter = -1;
        this.$refs.input_box.blur()
      },


    fixScroll() {
        var el =this.$refs.rows[this.arrowCounter]
        var row = el
        var rect = el.getBoundingClientRect()
        var rect2 = this.$refs['table-body'].getBoundingClientRect()

        if ( (rect.top+10) - rect2.top < 0 ) {
            row.scrollIntoView()
        } else if ( (rect.bottom+1) > rect2.bottom ) {
            row.scrollIntoView(false)
        }
    },
    resetScroll() {
        if (this.$refs.rows.length >= 0 ) {
            row =this.$refs.rows[0]
            row.scrollIntoView()
        }

    }
  
    }
  
};
</script>

<style>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }
</style>