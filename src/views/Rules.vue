<template>
    <div class="rules">
        <router-link class="arrow-link" :to='{name: "registration"}'>
            <i class="icon__arrow"></i>Перейти к регистрации
        </router-link>

        <div v-if="settings.rules_text" class="container-fluid">
            <div class="row content">
                <div class="col align-self-start" v-html="settings.rules_text"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'rules',
        computed: {
            ...mapState({
                settings: state => state.settings,
            }),
        }
    }
</script>
