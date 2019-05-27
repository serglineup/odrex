<template>
    <div class="col-md-11 mb-3">
        <div v-if="visit.diagnos" v-text="visit.diagnos" class="mb-3"></div>

        <div v-if="loading">
            Загрузка...
        </div>

        <div v-if="!loading" v-html="html">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'visit-document',
        props: {
            'visit': {
                required: true,
            },
        },
        data() {
            return {
                loading: true,
                html: null,
            };
        },
        mounted() {
            this.$store
                .dispatch('getVisitDocument', {id: this.$route.params['id']})
                .then(html => {
                    this.loading = false;
                    this.html = html;
                });
        },
    }
</script>
