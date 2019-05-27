<template>
    <div class="visits">
        <h2 class="profile__header">Записи</h2>
        <div class="visits__links">
            <router-link class="visits__link" :to="{name:'profile.visits.current.consultations'}">
                Консультации
                <template v-if="consultationsCurrentUnreadCount > 0">
                    <b class="link__badges">{{ consultationsCurrentUnreadCount }}</b>
                </template>
            </router-link>
            <router-link class="visits__link" :to="{name:'profile.visits.current.diagnostics'}">
                Диагностики
                <template v-if="diagnosticsCurrentUnreadCount > 0">
                    <b class="link__badges">{{ diagnosticsCurrentUnreadCount }}</b>
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
        name: 'visits-current',
        computed: {
            ...mapGetters({
                consultationsCurrentUnreadCount: 'consultationsCurrentUnreadCount',
                diagnosticsCurrentUnreadCount: 'diagnosticsCurrentUnreadCount',
            }),
        },
    }
</script>
