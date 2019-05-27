<template>
    <nav class="nav col">
        <div class="nav__top">
            <div class="nav__user">
                <router-link :to="{name:'profile'}">
                    {{ firstName }}
                </router-link>
                <router-link class="nav__settings" :to="{name:'profile.info'}"></router-link>
            </div>
            <b-dropdown id="ddown1" text="Записаться">
                <b-dropdown-item>
                    <router-link class="" :to="{name:'profile.order.find-doctor'}">
                        Записаться на приём
                    </router-link>
                </b-dropdown-item>
                <b-dropdown-item>
                    <router-link class="" :to="{name:'profile.order.find-diagnostic'}">
                        Пройти диагностику
                    </router-link>
                </b-dropdown-item>
            </b-dropdown>
            <router-link class="nav__link" :to="{name:'profile.visits.current'}">
                Записи
                <template v-if="visitCurrentUnreadCount > 0">
                    <div class="nav__badges">{{ visitCurrentUnreadCount }}</div>
                </template>
            </router-link>
            <router-link class="nav__link" :to="{name:'profile.visits.past'}">
                Посещения
                <template v-if="visitPastUnreadCount > 0">
                    <div class="nav__badges">{{ visitPastUnreadCount }}</div>
                </template>
            </router-link>
            <router-link v-if="analyzesUnreadCount > 0" class="nav__link" :to="{name:'profile.analyzes'}">
                Анализы
                <template v-if="analyzesUnreadCount > 0">
                    <div class="nav__badges">{{ analyzesUnreadCount }}</div>
                </template>
            </router-link>
            <b-link class="nav__link" @click="logout">
                Выйти
                <div class="nav__badges">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 492.5 492.5" style="enable-background:new 0 0 492.5 492.5;" xml:space="preserve">
                        <g>
                            <path d="M184.646,0v21.72H99.704v433.358h31.403V53.123h53.539V492.5l208.15-37.422v-61.235V37.5L184.646,0z M222.938,263.129   c-6.997,0-12.67-7.381-12.67-16.486c0-9.104,5.673-16.485,12.67-16.485s12.67,7.381,12.67,16.485   C235.608,255.748,229.935,263.129,222.938,263.129z" fill="#FFFFFF"/>
                        </g>
                        </svg>
                    </div>
            </b-link>
        </div>
        <div class="nav__bottom">
            <router-link class="nav__link" :to="{name:'profile.clinics'}">
                Адреса
            </router-link>

            <a class="link-bottom" href="tel:0487300030">
                <img src="~@/assets/images/ic-phone.svg" alt="Круглосуточная горячая линия">
                <span class="link-bottom-phone">+38 (048) 730-00-30<span class="small-desc">Круглосуточная горячая линия</span></span>
            </a>

            <router-link class="link-bottom link-bottom-border mobile-install" :to="{name:'mobile-install'}">
                <div class="link-bottom">
                    <img src="~@/assets/images/ic-mobile-app.svg" alt="Устанавливайте приложение Odrex">
                    Устанавливайте <br>
                    приложение Odrex
                </div>
            </router-link>

            <a target="_blank" href="https://odrex.ua">
                <img class="logo" src="~@/assets/images/logo-sidebar-grey.svg" alt="Odrex">
            </a>
        </div>
    </nav>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: 'navigation',
        computed: {
            ...mapState({
                name: state => state.auth.user.name,
                availableRecordToday: state => state.auth.user.available_record_today,
            }),
            ...mapGetters({
                visitPastUnreadCount: 'visitPastUnreadCount',
                visitCurrentUnreadCount: 'visitCurrentUnreadCount',
                analyzesUnreadCount: 'analyzesUnreadCount',
            }),
            firstName() {
                if (this.name) {
                    let [last_name = null, first_name = null, second_name = null] = this.name.split(' ');
                    return first_name;
                }

                return null;
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('logout')
            },
        },
        mounted() {
            this.$store
                .dispatch('getVisitsCurrent');

            this.$store
                .dispatch('getVisitsPast');

            this.$store
                .dispatch('getAnalyzes');
        },
    }
</script>
