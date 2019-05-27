<template>
    <div class="col-md-11 visits__items">
        <div v-if="consultationsVisitPast.length === 0">
            <div class="not-found row mt-5">
                <div class="col-3 d-flex justify-content-end">
                    <img src="~@/assets/images/zero-illu-01.svg" alt="">
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
             v-for="consultationVisitPast in consultationsVisitPast"
             :class='{ "read": consultationVisitPast.read }'>
            <i class="fa fa-check" aria-hidden="true"></i>

            <div class="date col-auto">
                {{ formatDate(consultationVisitPast.date) }}
                <span>в {{ consultationVisitPast.time }}</span>
            </div>

            <div class="name col-auto flex-row">
                <span class="avatar" :style="doctorAvatarStyle(consultationVisitPast)"></span>
                <span>
                    {{ getFirstName(consultationVisitPast.doctor) }}<br>
                    {{ getOtherName(consultationVisitPast.doctor) }}
                </span>
            </div>

            <div class="text col-auto">
                {{ consultationVisitPast.specialization_doctor_title }}
            </div>

            <!--<div class="download col">-->
                <!--<button class="icon__download" @click="downloadDocument()"></button>-->
                <!--<span class="icon__download-text">-->
                    <!--<span>PDF</span>-->
                    <!--<span>1.2 МБ</span>-->
                <!--</span>-->
            <!--</div>-->

            <button class="icon__info" @click="openDocumentModal(consultationVisitPast)"></button>

            <button class="btn btn-link-clear btn-icon"
                    @click="reOrder(consultationVisitPast)">
                <i class="fa fa-repeat" aria-hidden="true"></i>
            </button>

            <div class="delimiter w-100"></div>
        </div>

        <b-modal ref="documentModal" centered size="lg" hide-footer title="Документ">
            <div class="loading" v-if="selectedVisitPastContentLoading">
                Загрузка
            </div>

            <div class="content" v-if="selectedVisitPastContent" v-html="selectedVisitPastContent"></div>

            <div class="mt-3">
                <button class="btn-blue mr-1" v-if="selectedVisitPastContent" @click="downloadDocument()">Скачать</button>
                <button class="btn-blue" @click="hideDocumentModal()">Закрыть</button>
            </div>
        </b-modal>

        <b-modal ref="reorderModal" centered size="md" hide-footer title="Уведомление">
            <div class="content">
                Извините, повторная запись на прием к данному доктору невозможна.<br>
                Для записи обратитесь в call-центр по номеру:<br>
                <a href="tel:+380487300030">
                    +38 (048) 730-00-30
                </a>
            </div>

            <div class="mt-3">
                <button class="btn-blue" @click="hideReorderModal()">Закрыть</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    import fileSave from '../../helpers/file-save';
    import config from '../../api/config';
    import {Modal} from "bootstrap-vue/src/components";

    export default {
        name: 'consultations-past',
        data() {
            return {
                selectedVisitPast: null,
                selectedVisitPastContentLoading: false,
                selectedVisitPastContent: null,
            };
        },
        computed: {
            ...mapGetters({
                consultationsVisitPast: 'consultationsVisitPast',
            }),
        },
        methods: {
            reOrder(consultationVisit) {
                if (consultationVisit.can_reorder_doctor) {
                    let query = {
                        doctor_id: consultationVisit.doctor_id,
                        specialization_id: consultationVisit.reorder_specialization_id,
                    };

                    if (consultationVisit.clinic_id) {
                        query = {
                            ...query,
                            clinic_id: consultationVisit.clinic_id,
                        };
                    }

                    this.$router.push({
                        name: 'profile.order.choose-doctor-time-table',
                        query,
                    })
                } else {
                    this.$refs.reorderModal.show();
                }
            },
            hideReorderModal() {
                this.$refs.reorderModal.hide();
            },
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
            doctorAvatarStyle(consultationVisit) {
                let backgroundImage = 'url("/images/user-placeholder.png")';

                if (consultationVisit.doctor_url_image) {
                    backgroundImage = `url(${consultationVisit.doctor_url_image})`;
                }

                return {
                    backgroundImage,
                };
            },
            openDocumentModal(visitPast) {
                this.selectedVisitPastContent = null;
                this.selectedVisitPastContentLoading = true;

                this.selectedVisitPast = visitPast;
                this.$refs.documentModal.show();
                this.$store
                    .dispatch('getVisitDocument', visitPast)
                    .then(content => {
                        this.selectedVisitPastContent = content;
                        this.selectedVisitPastContentLoading = false;

                        this.$store
                            .dispatch('getVisitsPast');
                    })
            },
            hideDocumentModal() {
                this.$refs.documentModal.hide();
                this.selectedVisitPastContent = null;
            },
            downloadDocument() {
                if (this.selectedVisitPastContent) {
                    fileSave({
                        blob: this.selectedVisitPastContent,
                        type: 'text/html',
                        name: this.selectedVisitPast.specialization_doctor_title,
                    });
                }
            },
        },
        mounted() {
            this.$store
                .dispatch('getVisitsPast');
        },
        components: {
            Modal,
        },
    }
</script>
