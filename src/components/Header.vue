<template>
<nav class="navbar" role="navigation" aria-label="main navigation" style="height:20px;">
    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" v-if="display.add"> <strong>Add Row</strong> </a>
                </div>
            </div>

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" v-if="display.new_sheet"> <strong>New Sheet</strong> </a>
                </div>
            </div>


            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" v-if="display.save"> <strong>Save</strong> </a>
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
                    <a class="button is-light"> <strong>Pull Data</strong> </a>
                </div>
            </div>

            <!-- end pull data -->

            <!-- pagination -->
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light"> <strong>Previous Page</strong> </a>
                </div>
            </div>

            <div class="navbar-item">1</div>

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light"> <strong>Next Page</strong> </a>
                </div>
            </div>
            <!--end paginaiont -->

            <!-- filter and sort -->
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light"><strong>Filter</strong> </a>
                    <a class="button is-light"><strong> Sort </strong> </a>
                </div>
            </div>
            <!-- end filter and sort -->

        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" @click="Help()"><strong>Help</strong> </a>
                </div>
            </div>
        </div>
    </div>
</nav>
</template>

<script>

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
        }
    },


    data () {
        return {
            //show icons for header?
            display: {
                'home': false,
                'help': false,
                'links': false,
                'page':  false, //for pagination
                'save':  false,
                'add':   false,
                'new_sheet': false
            }
        }

    },
    methods: {
        Help() { this.$emit('help') },
        NextPage() { this.$emit('next-page') } ,
        PreviousPage() { this.$emit('previous-page') },
        Add() { this.$emit('add-row')},
        NewSheet() { this.$emit('new-sheet')},
        Save() {this.$emit('save')   },
        ToUrl(urlPath) {
            console.log(urlPath)
        }
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