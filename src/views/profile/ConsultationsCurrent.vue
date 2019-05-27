<template>
    <div class="col-md-11 visits__items">
        <div v-if="consultationsVisitCurrent.length === 0">
            <div class="not-found row mt-5">
                <div class="col-3 d-flex justify-content-end">
                    <img src="~@/assets/images/zero-illu-01.svg"" alt="">
                </div>
                <div class="col-7">
                    <div class="mb-3">
                        У вас ещё не было ни одного посещения консультации.
                    Возможно, вы хотите посетить первую?
                    </div>                  
                    <router-link :to="{name:'profile.order.find-doctor'}" class="btn w-auto">
                        Записаться на консультацию
                    </router-link>
                </div>
            </div>
        </div>

        <div class="visits__item row"
             v-for="consultationVisitCurrent in consultationsVisitCurrent">
            <div class="date col-3">
                {{ formatDate(consultationVisitCurrent.date) }}
                <span>в {{ consultationVisitCurrent.time }}</span>
            </div>

            <div class="col-1">
                <div class="avatar" :style="doctorAvatarStyle(consultationVisitCurrent)"></div>
            </div>

            <div class="name col-4">
                <span>
                    {{ getFirstName(consultationVisitCurrent.doctor) }}<br>
                    {{ getOtherName(consultationVisitCurrent.doctor) }}
                </span>
            </div>

            <div class="text col-2">
                {{ consultationVisitCurrent.specialization_doctor_title }}
            </div>

            <div class="text col-2">
                <button v-if="consultationVisitCurrent.payment_status != 'PAY'"
                        @click="pay(consultationVisitCurrent)"
                        type="button"
                        class="btn btn-sm btn-green">
                    Оплатить
                </button>
            </div>

            <!--<button class="icon__close" @click="selectVisitCurrent(consultationVisitCurrent)"></button>-->

            <div class="delimiter w-100"></div>
        </div>

        <b-modal ref="confirmationModal" centered hide-footer title="Подтверждение">
            Вы точно хотите удалить запись?

            <div class="mt-3">
                <button class="btn-blue" @click="cancelVisitCurrent()">
                    Да
                </button>
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
        name: 'consultations-current',
        data() {
            return {
                selectedVisitCurrentCancel: null,
            };
        },
        computed: {
            ...mapGetters({
                consultationsVisitCurrent: 'consultationsVisitCurrent',
            }),
        },
        methods: {
            formatDate(date) {
                return moment(date).format(config.DATE_FORMAT_OUTPUT);
            },
            getFirstName(name) {
                const [last_name = '', first_name = '', second_name = ''] =  name.split(' ');
                return first_name;
            },
            getOtherName(name) {
                const [last_name = '', first_name = '', second_name = ''] =  name.split(' ');
                return [last_name, second_name].join(' ');
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
            doctorAvatarStyle(consultationVisit) {
                let backgroundImage = 'url("/images/user-placeholder.png")';

                if (consultationVisit.doctor_url_image) {
                    backgroundImage = `url(${consultationVisit.doctor_url_image})`;
                }

                return {
                    backgroundImage,
                };
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
