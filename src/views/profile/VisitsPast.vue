<template>
    <div class="visits">
        <h2 class="profile__header">Прошлые посещения</h2>
        <div class="visits__links">
            <router-link class="visits__link" :to="{name:'profile.visits.past.consultations'}">
                Консультации
                <template v-if="consultationsPastUnreadCount > 0">
                    <b class="link__badges">{{ consultationsPastUnreadCount }}</b>
                </template>
            </router-link>
            <router-link class="visits__link" :to="{name:'profile.visits.past.diagnostics'}">
                Диагностики
                <template v-if="diagnosticsPastUnreadCount > 0">
                    <b class="link__badges">{{ diagnosticsPastUnreadCount }}</b>
                </template>
            </router-link>
        </div>
        <div class="row">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'visits-past',
        computed: {
            ...mapGetters({
                consultationsPastUnreadCount: 'consultationsPastUnreadCount',
                diagnosticsPastUnreadCount: 'diagnosticsPastUnreadCount',
            }),
        },
    }
</script>
