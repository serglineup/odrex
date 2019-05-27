<template>
    <div class="diagnostics-past col-md-11 visits__items">
        <template v-if="diagnosticsVisitPast.length === 0">
            <div class="not-found row mt-5">
                <div class="col-3 d-flex justify-content-end">
                    <img src="~@/assets/images/zero-illu-01.svg" alt="">
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
        </template>

        <div class="visits__item row"
             v-for="diagnosticVisitPast in diagnosticsVisitPast"
             :class='{ "read": diagnosticVisitPast.read }'>
            <i class="fa fa-check" aria-hidden="true"></i>

            <div class="date col-3">
                {{ formatDate(diagnosticVisitPast.date) }}
                <span>в {{ diagnosticVisitPast.time }}</span>
            </div>

            <div class="col-3">
                <div class="text">{{ diagnosticVisitPast.diagnostic_type_title }}</div>
                <b v-if="diagnosticVisitPast.diagnostic_type_can_choose_doctor">
                    {{ diagnosticVisitPast.doctor }}
                </b>
            </div>

            <div class="col-4">
                <div class="text">{{ diagnosticVisitPast.diagnostic }}</div>
            </div>

            <button class="icon__info" @click="openDocumentModal(diagnosticVisitPast)"></button>

            <button class="btn btn-link-clear btn-icon"
                    @click="reOrder(diagnosticVisitPast)">
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
                Извините, повторная запись на данную диагностику невозможна.<br>
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
        name: 'diagnostics-past',
        data() {
            return {
                selectedVisitPast: null,
                selectedVisitPastContentLoading: false,
                selectedVisitPastContent: null,
            };
        },
        computed: {
            ...mapGetters({
                diagnosticsVisitPast: 'diagnosticsVisitPast',
            }),
        },
        methods: {
            reOrder(diagnosticVisitPast) {
                if (diagnosticVisitPast.can_reorder_diagnostic) {
                    let query = {
                        diagnostic_id: diagnosticVisitPast.reorder_diagnostic_id,
                        diagnostic_type_id: diagnosticVisitPast.diagnostic_type_id,
                        clinic_id: diagnosticVisitPast.clinic_id,
                    };

                    this.$router.push({
                        name: 'profile.order.choose-diagnostic-time-table',
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
                        name: this.selectedVisitPast.diagnostic,
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

<style lang="scss">
    .diagnostics-past {
        & > .not-found {
            margin-left: 0;
            margin-right: 0;

/*            padding-top: 60px;
            padding-bottom: 60px;*/

            border-radius: 5px;
            background-color: #f2f8fa;

            & .row {
                background-color: #f2f8fa;
            }

            & > div:first-child {
                & > img {
                    max-width: 100%;
                }
            }

            & > div:last-child {
                & .btn {
/*                    margin-top: 15px;*/
                }
            }
        }

        & > .visits__item:last-child .delimiter {
            display: none;
        }
    }
</style>
