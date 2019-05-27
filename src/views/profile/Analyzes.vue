<template>
    <div class="analyzes">
        <h2>Анализы</h2>

        <div v-if="analyzes.length === 0">
            Анализов нет
        </div>

        <div class="item row" v-for="analyze in analyzes" :class='{ "read": analyze.read }'>
            <i class="fa fa-check" aria-hidden="true"></i>

            <div class="col-2 d-flex align-items-center justify-content-start">
                {{ formatDate(analyze.date) }}
            </div>

            <div class="col-8 d-flex align-items-center justify-content-start">
                {{ analyze.title }}
            </div>

            <div class="download col-2 d-flex align-items-center justify-content-end">
                <button @click="openAnalyzeModal(analyze)" class="icon__info"></button>
                <span>PDF</span>
            </div>
        </div>

        <b-modal ref="analyzeModal" centered size="lg" hide-footer title="Документ">
            <div class="loading" v-if="selectedAnalyzeContentLoading">
                Загрузка
            </div>

            <iframe class="content" ref="analyzeContent"></iframe>

            <div class="mt-3">
                <button class="btn-blue mr-1" v-if="selectedAnalyzeContent" @click="downloadAnalyze()">Скачать</button>
                <button class="btn-blue" @click="hideAnalyzeModal()">Закрыть</button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import fileSave from '../../helpers/file-save'
    import moment from 'moment'
    import config from '../../api/config';

    export default {
        name: 'analyzes',
        data() {
            return {
                selectedAnalyze: null,
                selectedAnalyzeContentLoading: false,
                selectedAnalyzeContent: null,
            };
        },
        computed: mapState({
            analyzes: state => state.analyzes,
        }),
        methods: {
            formatDate(date) {
                return moment(date).format(config.DATE_FORMAT_OUTPUT);
            },
            openAnalyzeModal(analyze) {
                this.selectedAnalyzeContent = null;
                this.$refs.analyzeContent.src = '';
                this.selectedAnalyzeContentLoading = true;

                this.selectedAnalyze = analyze;
                this.$refs.analyzeModal.show();
                this.$store
                    .dispatch('getAnalyze', analyze)
                    .then(content => {
                        this.selectedAnalyzeContent = content;
                        this.selectedAnalyzeContentLoading = false;

                        this.$refs.analyzeContent.src = window.URL.createObjectURL(content);

                        this.$store
                            .dispatch('getAnalyzes');
                    })
            },
            hideAnalyzeModal() {
                this.$refs.analyzeModal.hide();
                this.selectedAnalyzeContent = null;
                this.$refs.analyzeContent.src = '';
            },
            downloadAnalyze() {
                if (this.selectedAnalyzeContent) {
                    fileSave({
                        blob: this.selectedAnalyzeContent,
                        type: 'application/pdf',
                        name: this.selectedAnalyze.title,
                    });
                }
            },
        },
        mounted() {
            this.$store
                .dispatch('getAnalyzes');
        },
    }
</script>

<style lang="scss">
    .analyzes {
        & > h2 {
            font-size: 42px;
            color: #0a4766;
            margin-top: 25px;
        }

        & > .item {
            min-height: 90px;

            &:not(:first-child) {
                border-bottom: 2px solid rgba(163, 190, 204, 0.25);
            }

            & > .download {
                & > *:not(:last-child) {
                    margin-right: 10px;
                }
            }

            &:last-child {
                border-bottom: none;
            }
        }

        iframe.content {
            width: 100%;
            min-height: 75vh;
        }
    }
</style>
