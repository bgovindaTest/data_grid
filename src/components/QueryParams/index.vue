<template>

<div>
    <!-- tabas  -->
    <div class="tabs is-centered">
        <ul>
            <li :class="SortActive"   @click="UpdateActive('Sort')" ><a>Sort</a></li>
            <li :class="FilterActive" @click="UpdateActive('Filter')"><a>Filter</a></li>
            <li :class="PageActive"   @click="UpdateActive('Page')" ><a>Page</a></li>
        </ul>
    </div>

    <div class="container" v-if = "current_tab == 'Sort'"> SortActive</div>
    <div class="container" v-else-if = "current_tab == 'Filter'"> FilterActive </div>
    <div class="container" v-else-if = "current_tab == 'Page'"> PageActive </div>


</div>

</template>

<script>

export default {

    data() {
        return {
            current_tab: "Sort",
        }
    },
    computed: {
        SortActive() { return { 'is-active': this.current_tab == "Sort" } },
        PageActive() { return { 'is-active': this.current_tab == "Page" } },
        FilterActive() { return { 'is-active': this.current_tab == "Filter" } },
    },
    methods: {
        UpdateActive(tab_name) { this.current_tab = tab_name}
    }

}
</script>




<style lang="scss" scoped>
    @import '@/assets/bulma.scss';
</style>