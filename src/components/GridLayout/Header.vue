<template>
<nav class="navbar" role="navigation" aria-label="main navigation" style="height:20px;">
    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light"> <strong>Add Row</strong> </a>
                </div>
            </div>

            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light"> <strong>Save</strong> </a>
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">SubGrids</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item">About</a>
                    <a class="navbar-item">Jobs</a>
                    <a class="navbar-item">Contact</a>
                    <hr class="navbar-divider">
                    <a class="navbar-item">Report an issue</a>
                </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Links</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item">About</a>
                    <a class="navbar-item">Jobs</a>
                    <a class="navbar-item">Contact</a>
                    <hr class="navbar-divider">
                    <a class="navbar-item">Report an issue</a>
                </div>
            </div>
            <!--search bar -->
            <input class="navbar-item input is-primary mt-1" type="text" placeholder="Quick search citeria then pull data" style="max-width: 450px;">
            <!-- end search bar -->

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
                    <a class="button is-light"> <strong>Previous</strong> </a>
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
                    <a class="button is-primary"><strong>Home</strong> </a>
                    <a class="button is-light"><strong>Help</strong> </a>
                </div>
            </div>
        </div>
    </div>
</nav>
</template>

<script>

export default {

  methods: {

  }

}


</script>