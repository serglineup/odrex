<template>
    <div class="col-md-11 visits__items">
        <div v-if="diagnosticsVisitCurrent.length === 0">
            <div class="not-found row mt-5">
                <div class="col-3 d-flex justify-content-end">
                    <img src="~@/assets/images/zero-illu-01.svg"" alt="">
                </div>
                <div class="col-7">
                    <div class="mb-3">
                        У вас ещё не было ни одного посещения диагностики.
                    Возможно, вы хотите посетить первую?
                    </div>                  
                    <router-link :to="{name:'profile.order.find-diagnostic'}" class="btn w-auto">
                        Записаться на диагностику
                    </router-link>
                </div>
            </div>
        </div>

        <div class="visits__item row" v-for="diagnosticVisitCurrent in diagnosticsVisitCurrent">
            <div class="date col-3">
                {{ formatDate(diagnosticVisitCurrent.date) }}
                <span>в {{ diagnosticVisitCurrent.time }}</span>
            </div>

            <div class="col-7">
                <div class="text">{{ diagnosticVisitCurrent.diagnostic }}</div>
            </div>

            <div class="text col-2">
                <button v-if="diagnosticVisitCurrent.payment_status != 'PAY'"
                        @click="pay(diagnosticVisitCurrent)"
                        type="button"
                        class="btn btn-sm btn-green">
                    Оплатить
                </button>
            </div>

            <!--<button class="icon__close" @click="selectVisitCurrent(diagnosticVisitCurrent)"></button>-->

            <div class="delimiter w-100"></div>
        </div>

        <b-modal ref="confirmationModal" centered hide-footer title="Подтверждение">
            Вы точно хотите удалить запись?

            <div class="mt-3">
                <button class="btn-blue" @click="cancelVisitCurrent()">Да</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {Modal} from 'bootstrap-vue/src/components';
    import moment from 'moment';
    import config from '../../api/config';

    export default {
        name: 'diagnostics-current',
        data() {
            return {
                selectedVisitCurrentCancel: null,
            };
        },
        computed: {
            ...mapGetters({
                diagnosticsVisitCurrent: 'diagnosticsVisitCurrent',
            }),
        },
        methods: {
            formatDate(date) {
                return moment(date).format(config.DATE_FORMAT_OUTPUT);
            },
            selectVisitCurrent(visit) {
                this.selectedVisitCurrentCancel = visit;
                this.$refs.confirmationModal.show();
            },
            cancelVisitCurrent() {
                this.$store
                    .dispatch('setVisitCurrentCancel', this.selectedVisitCurrentCancel)
                    .then(() => {
                        this.$refs.confirmationModal.hide();

                        this.$store
                            .dispatch('getVisitsCurrent');
                    });
            },
            pay({id}) {
                this.$store.dispatch('getVisitPaymentLink', id)
                    .then(({data: {enter_url, params}}) => {
                        this.$refs.confirmationModal.hide();

                        let form = document.createElement("form");

                        form.setAttribute("method", 'POST');
                        form.setAttribute("action", enter_url);

                        for (let paramKey in params) {
                            let hiddenField = document.createElement("input");

                            hiddenField.setAttribute("type", "hidden");
                            hiddenField.setAttribute("name", paramKey);
                            hiddenField.setAttribute("value", params[paramKey]);

                            form.appendChild(hiddenField);
                        }

                        document.body.appendChild(form);

                        form.submit();
                    });
            },
        },
        mounted() {
            this.$store
                .dispatch('getVisitsCurrent');
        },
        components: {
            Modal,
        },
    }
</script>
