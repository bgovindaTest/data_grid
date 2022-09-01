<template>
<nav class="navbar is-info" role="navigation" aria-label="main navigation" style="height:20px;">
    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" v-if="display.add_row" @click="Add()"> <strong>Add</strong> </a>
                </div>
            </div>

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" v-if="display.new_sheet" @click="NewSheet()"> <strong>New Sheet</strong> </a>
                </div>
            </div>

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" v-if="display.save" @click="Save()"> <strong>Save</strong> </a>
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" v-if="display.links" >Links</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" v-for="link in links" :key="link" @click="ToUrl(link.url)">{{link.name}}</a>
                </div>
            </div>

            <!-- pull data -->
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" @click="PullData()"> <strong>Pull</strong> </a>
                </div>
            </div>

            <!-- end pull data -->

            <!-- pagination -->
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" @click="PreviousPage()"> <strong><font-awesome-icon :icon="['fas', 'arrow-left']" /></strong> </a>
                </div>
            </div>

            <div class="navbar-item">{{page_number}}</div>

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" @click="NextPage()"> <strong><font-awesome-icon :icon="['fas', 'arrow-right']" /></strong> </a>
                </div>
            </div>
            <!--end paginaiont -->

            <!-- filter and sort -->
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" @click="FilterModal()" ><strong>Filter</strong> </a>
                    <a class="button is-light" @click="OrderByModal()"><strong> Sort </strong> </a>
                    <a class="button is-light" @click="LogData()" v-if="display.is_test"><strong> Log </strong> </a>
                </div>
            </div>
            <!-- end filter and sort -->

        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" @click="LogOut()"><strong>LogOut</strong> </a>
                    <a class="button is-light" @click="Help()"><strong>Help</strong> </a>
                </div>
            </div>
        </div>
    </div>
</nav>
</template>

<script>

// https://jsfiddle.net/sol_b/mndrLjzk/4/
const axiosParams    = require('../axios_params')

export default {
    props: {
        navHeaderParams: {
            type: Object,
            default: {}
        },
        links: {
            type: Object,
            default: [
                {'name': 'Home',  'url': "/"},
            ]
        },
        page_number: {
            type: Number,
            default: -1
        },
        disable_navbar: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            //show icons for header?
            display: {
                'home': false,
                'help': false,
                'links': false,
                'previous_page':  false, //for pagination
                'next_page':  false, //for pagination
                'pull_data':  false, //for pagination
                'page_number': true,
                'save':  false,
                'add_row':   true,
                'new_sheet': false,
                'is_test': false
            }
        }
    },
    methods: {
        Help() {         if (! this.disable_navbar) {this.$emit('help') } },
        PullData() {     if (! this.disable_navbar) {this.$emit('pull-data') } },
        NextPage() {     if (! this.disable_navbar) {this.$emit('next-page') } },
        PreviousPage(){  if (! this.disable_navbar) {this.$emit('previous-page') } },
        Add() {          if (! this.disable_navbar) {this.$emit('add-row')} },
        NewSheet() {     if (! this.disable_navbar) {this.$emit('new-sheet')} },
        Save() {         if (! this.disable_navbar) {this.$emit('save')   } },
        FilterModal()  { if (! this.disable_navbar) {this.$emit('filter-modal')} },
        OrderByModal() { if (! this.disable_navbar) {this.$emit('orderby-modal')   } },
        LogData()      { if (! this.disable_navbar) {this.$emit('log-data')   } },
        ToUrl(urlPath) { if (! this.disable_navbar) { window.location.href = urlPath  }},
        LogOut() { window.location.href = axiosParams.logoutRoute }
    },
    mounted() {
        let dx = Object.keys(this.display)
        for (let i =0; i < dx.length; i++ ) {
            let x = dx[i]
            if (this.navHeaderParams.hasOwnProperty(x) ) {
                this.display[x] = this.navHeaderParams[x]
            }
        }
        if (this.links.length > 0) { this.display['links'] = true }
    }
}


</script>