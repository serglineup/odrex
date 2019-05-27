<template>
    <router-view class="app"></router-view>
</template>

<script>
    export default {
        mounted() {
            setTimeout(() => {
                this.$store.dispatch('clearError');
            }, 5000);

            setTimeout(() => {
                this.$store.dispatch('clearSuccess');
            }, 10000);

            this.$store.dispatch('getSettings');
        },
    }
</script>
