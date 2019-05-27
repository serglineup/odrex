<template>
    <div class="dashboard">
        <h2 class="profile__header">Мой кабинет</h2>

        <div class="dashboard__wrapper row align-items-start">
            <carousel v-if="sliders && sliders.length > 0" class="dashboard__slider col-md-12" :perPage="1" :autoplay="true" :loop="true" :autoplayTimeout="5000" :autoplayHoverPause="true">
                <template v-if="sliders">
                    <slide class="dashboard__slide" v-for="slider in sliders" :key="slider.id">
                        <img :src="slider.image" alt="">
                        <a target="_blank" class="content" :href="slider.link">
                            <div class="type">Пакет</div>
                            <div class="name">
                                {{ slider.text }}
                            </div>
                            <div class="price">
                                {{ slider.price }} грн
                                <span class="sale">−{{ slider.discount }}%</span>
                            </div>
                        </a>
                    </slide>
                </template>
            </carousel>
        </div>

        <div class="row mb-3">
            <div v-if="lastVisitsCurrent && lastVisitsCurrent.length > 0" class="col-md-6">
                <div class="entry__wrapper">
                    <h3>Ближайшие записи</h3>

                    <template v-if="lastVisitsCurrent">
                        <div class="entry" v-for="lastVisitCurrent in lastVisitsCurrent">
                            <div class="entry__header">
                                <template v-if="isToday(lastVisitCurrent.date)">
                                    <span class="danger">Сегодня в {{ lastVisitCurrent.time }}</span>
                                </template>
                                <template v-else>
                                    {{ formatDate(lastVisitCurrent.date) }} в {{ lastVisitCurrent.time }}
                                </template>

                                <span v-if="lastVisitCurrent.specialization">Консультация</span>
                                <span v-if="lastVisitCurrent.diagnostic">Диагностика</span>
                            </div>

                            <div v-if="lastVisitCurrent.specialization" class="entry__title">
                                <span>{{ lastVisitCurrent.doctor }}</span>
                                <span class="entry__title_light">{{ lastVisitCurrent.specialization_doctor_title }}</span>
                            </div>

                            <div v-if="lastVisitCurrent.diagnostic" class="entry__title">
                                <span>{{ lastVisitCurrent.diagnostic }}</span>
                            </div>

                            <div class="entry__place">
                                {{ lastVisitCurrent.clinic }}
                            </div>

                            <!--<button class="icon__close" @click="selectVisitCurrent(lastVisitCurrent)"></button>-->
                        </div>
                    </template>

                    <router-link class="btn-blue" :to="{name:'profile.visits.current'}">
                        Все записи
                    </router-link>
                </div>
            </div>

            <div v-if="lastAnalyzes && lastAnalyzes.length > 0" class="col-md-6">
                <div class="entry__wrapper">
                    <h3>Последние анализы</h3>

                    <template v-if="lastAnalyzes">
                        <div class="entry entry-old" v-for="lastAnalyze in lastAnalyzes">
                            <div class="entry__header">
                                <template v-if="isToday(lastAnalyze.date)">
                                    <span class="danger">Сегодня</span>
                                </template>
                                <template v-else>
                                    {{ formatDate(lastAnalyze.date) }}
                                </template>
                            </div>

                            <div class="entry__title">
                                <span>{{ lastAnalyze.title }}</span>
                            </div>

                            <div class="entry__download">
                                <button @click="analyzeDownload(lastAnalyze)" class="icon__download"></button>
                                <span>PDF</span>
                            </div>
                        </div>
                    </template>

                    <router-link class="btn-blue" :to="{name:'profile.analyzes'}">
                        Все анализы
                    </router-link>
                </div>
            </div>
        </div>

        <div v-if="lastVisitsCurrent && lastVisitsCurrent.length === 0 && lastAnalyzes && lastAnalyzes.length === 0">
            <div class="row">
                <div class="col-4 d-flex justify-content-end">
                    <img src="~@/assets/images/zero-illu-01.svg" alt="">
                </div>
                <div class="col-6">
                    <div class="mb-3">
                        У нас нет информации о ваших визитах в клинику и результатах анализов. Если вы ещё не посещали Odrex, вы можете записаться на консультацию врача или диагностику прямо сейчас:
                    </div>
                    <router-link :to="{name:'profile.order.find-doctor'}" class="btn w-auto">
                        Записаться на консультацию
                    </router-link>
                    <router-link :to="{name:'profile.order.find-diagnostic'}" class="btn w-auto">
                        Записаться на диагностику
                    </router-link>
                </div>
            </div>
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
    import {mapState} from 'vuex';
    import Carousel from 'vue-carousel/src/Carousel';
    import Slide from 'vue-carousel/src/Slide';
    import {Modal} from 'bootstrap-vue/src/components';
    import fileSave from '../../helpers/file-save'
    import config from '../../api/config';
    import moment from 'moment';

    export default {
        name: 'dashboard',
        data() {
            return {
                sliders: [],
                selectedVisitCurrentCancel: null,
            };
        },
        computed: {
            ...mapState({
                lastAnalyzes: state => {
                    if (state.analyzes) {
                        return state.analyzes.slice(0, 3);
                    }

                    return null;
                },
                lastVisitsCurrent: state => {
                    if (state.visitsCurrent) {
                        return state.visitsCurrent.slice(0, 3);
                    }

                    return null;
                },
            }),
        },
        methods: {
            formatDate(date) {
                return moment(date).format(config.DATE_FORMAT_OUTPUT);
            },
            isToday(date) {
                return moment(date).format(config.DATE_FORMAT) === moment(new Date()).format(config.DATE_FORMAT);
            },
            analyzeDownload(analyze) {
                this.$store
                    .dispatch('getAnalyze', analyze)
                    .then((blob) => {
                        fileSave({
                            blob,
                            name: `${analyze.title}.pdf`,
                            type: 'application/pdf',
                        })
                    });
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
        },
        mounted() {
            this.$store
                .dispatch('getSliders')
                .then(sliders => {
                    this.sliders = sliders;
                });

            this.$store
                .dispatch('getVisitsCurrent');

            this.$store
                .dispatch('getAnalyzes');
        },
        components: {
            Carousel,
            Slide,
            Modal,
        }
    }
</script>
