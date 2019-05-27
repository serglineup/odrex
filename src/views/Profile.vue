<template>
    <div class="profile">
        <div class="container">
            <div class="row">
                <div class="col profile__page">
                    <router-view></router-view>
                    <button type="button" class="close btn-vue-close" aria-label="Close" onclick="toggle_visibility('odrex-vue-wrapper');">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>

        <b-modal v-model="modal"
                 centered
                 hide-footer
                 hide-header
                 :no-close-on-esc="true"
                 :no-close-on-backdrop="true"
                 :no-enforce-focus="true"
                 title="Уведомление">
            <p>
                Прежде чем начать пользователь аккаунтом необходимо подтвердить свой email.
            </p>

            <p>
                Для этого перейтиде по ссылке, которую мы прислали на вашу почту {{ email }}
            </p>

            <div class="mt-3">
                <button class="btn btn-sm btn-green" @click="closeConfirmEmailModal()">
                    Выйти из аккаунта
                </button>
            </div>
        </b-modal>

        <b-modal v-model="paymentResultModal"
                 centered
                 hide-footer
                 hide-header
                 :no-close-on-esc="true"
                 :no-close-on-backdrop="true"
                 :no-enforce-focus="true"
                 title="Уведомление">
            <p v-if="paymentResult">
                Оплата прошла успешно.
            </p>

            <p v-if="!paymentResult">
                Во время оплаты возникли ошибки. Код ошибки: {{ paymentCode }}
            </p>

            <div class="mt-3">
                <button class="btn btn-sm btn-green" @click="closePaymentResultModal()">
                    Закрыть
                </button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import Navigation from './profile/Navigation.vue';

    export default {
        name: 'profile',
        data() {
            return {
                modal: false,
                paymentResultModal: false,
                paymentResult: null,
                paymentCode: null,
            };
        },
        methods: {
            closeConfirmEmailModal() {
                this.$store.dispatch('logout');
            },
            closePaymentResultModal() {
                this.paymentResultModal = false;
                this.$router.push({
                    name: 'profile',
                });
            },
        },
        computed: {
            ...mapState({
                email: state => state.auth.user.email,
            }),
        },
        mounted() {
            this.$store.dispatch('updateInfo')
                .then(() => {
                    if (!this.$store.state.auth.user.confirm_email) {
                        this.modal = true;
                    }
                });

            if (this.$route.query.success) {
                this.paymentResultModal = true;

                this.paymentResult =
                    this.$route.query.success === '1' ||
                    this.$route.query.success === 'true' ;

                this.paymentCode = this.$route.query.code || '-';
            }
        },
        beforeMount() {

        },
        components: {
            Navigation,
        }
    }
</script>
