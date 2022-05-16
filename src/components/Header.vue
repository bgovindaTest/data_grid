<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">


    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
        <a class="navbar-item">
            Home
        </a>

        <a class="navbar-item">
            Documentation
        </a>

        <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
            Links

            </a>

            <div class="navbar-dropdown">
            <a class="navbar-item">
                About
            </a>
            <a class="navbar-item">
                Jobs
            </a>
            <a class="navbar-item">
                Contact
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
                Report an issue
            </a>
            </div>
        </div>
        </div>

        <div class="navbar-end">
        <div class="navbar-item">
            <div class="buttons">
            <a class="button is-primary">
                <strong>Sign up</strong>
            </a>
            <a class="button is-light">
                Log in
            </a>
            </div>
        </div>
        </div>
    </div>
    </nav>
</template>

<script>

export default {


}


</script>

<style lang="scss" scoped>
    @import '../assets/bulma.scss';
</style>