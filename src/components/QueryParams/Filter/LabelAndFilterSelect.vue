<!--
Creates label and filter options

-->
<template>
<div  >

    <!-- </template> -->
    <label class="label mr-3" style="display: inline;">Input</label>
    <div class="select is-small">
        <select v-model="filter_object.operator">
            <option v-for="(ox, index) in options_list" :key="index" >{{ox}}</option>
        </select>
    </div>
    <!-- need a clear and a delete -->
</div>
</template>

<script>


export default {
    props: [options_list, filter_object ]

}
</script>
