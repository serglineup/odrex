<template>
    <div class="results">
        <h2 class="profile__header header">
            <div>Пройти диагностику</div>
            <span>Результаты поиска</span>

            <span v-if="selectedDiagnosticType" class="diagnostic-type">
                Вид диагностики: {{ selectedDiagnosticType.title }}
            </span>

            <span v-if="selectedClinic" class="clinic">
                {{ selectedClinic.short_title }}
            </span>

            <router-link class="icon__edit" :to="routerLinkOrderFindDiagnostic()"></router-link>
        </h2>
        <div class="row">
            <div class="col-8">
                <div class="row" v-if="loading">
                        <div class="col-6 offset-6">
                              <!-- Preloader -->
                              <div class="circonf-wrapper">
                                <div class="circonf circonf-1">
                                </div>
                                <p>Ваш запрос обрабатывается.</p>
                                <p>Пожалуйста, не перезагружайте страницу</p>
                              </div>
                              <!-- End of Preloader -->
                        </div>
                </div>
                <div v-if="!loading && diagnostics.length === 0">
                    К сожалению, нам не удалось найти соответствующую услугу по вашему запросу. Вы можете:

                    <ul class="variants">
                        <li class="my-2 ml-4">
                            <router-link :to="routerLinkOrderChooseDiagnosticWithoutAddress()">
                                Подобрать диагностику по другому адресу
                            </router-link>
                        </li>
                        <li class="my-2 ml-4">
                            <router-link :to="routerLinkOrderFindDiagnostic()">
                                Попробовать записаться заново
                            </router-link>
                        </li>
                        <li class="my-2 ml-4">
                            <a href="tel:0487300030">
                                Связаться с нашими администраторами по телефону +38 (048) 730-00-30
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-for="diagnostic in diagnostics" class="doctor d-flex flex-row align-items-stretch">
                    <div class="info_container flex-grow-1">
                        <div class="name">{{ diagnostic.title }}</div>
                    </div>
                    <div class="order_button_container">
                        <router-link v-if="diagnostic.clinics.length > 0" class="btn" :to="routerLinkOrderChooseDiagnosticTimeTable(diagnostic)">
                            Записаться
                        </router-link>
                        <a v-if="diagnostic.link" :href="diagnostic.link" class="p-btn p-btn-grey p-btn-block">Подробнее</a>

                        <p v-if="diagnostic.clinics.length === 0">
                            Нет доступных сеансов
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-4" v-if="!loading">
                <div class="doctor-not-found-card card">
                    <span class="header">Не получается самостоятельно найти диагностику?</span>
                    <span class="text">Сотрудники нашего колл-центра с радостью помогут вам записаться на приём.</span>
                    <span class="phone">
                        Позвоните:<br/>
                        <a href="tel:0487300030" class="phone">
                            +38 (048) 730-00-30
                        </a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'order-choose-diagnostic',
    props: {
        diagnostic_type_id: {
            required: true,
            type: [Number, String],
        },
        clinic_id: {
            required: false,
            type: [Number, String],
        },
        guest: {
            default: false,
            type: [Boolean],
        },
    },
    data() {
        return {
            selectedDiagnosticType: null,
            selectedClinic: null,
            diagnostics: [],
            loading: true,
        }
    },
    methods: {
        routerLinkOrderFindDiagnostic() {
            let query = {};

            if (this.selectedDiagnosticType) {
                query = {
                    ...query,
                    diagnostic_type_id: this.selectedDiagnosticType.id,
                };
            }

            if (this.selectedClinic) {
                query = {
                    ...query,
                    clinic_id: this.selectedClinic.id,
                };
            }

            if (this.guest) {
                return {
                    name: 'order.find-diagnostic',
                    query,
                };
            } else {
                return {
                    name: 'profile.order.find-diagnostic',
                    query,
                };
            }
        },
        routerLinkOrderChooseDiagnosticWithoutAddress() {
            let query = {};

            if (this.selectedDiagnosticType) {
                query = {
                    ...query,
                    diagnostic_type_id: this.selectedDiagnosticType.id,
                };
            }

            if (this.guest) {
                return {
                    name: 'order.find-diagnostic',
                    query,
                };
            } else {
                return {
                    name: 'profile.order.find-diagnostic',
                    query,
                };
            }
        },
        routerLinkOrderChooseDiagnosticTimeTable(diagnostic) {
            let query = {
                diagnostic_id: diagnostic.id,
                diagnostic_type_id: diagnostic.diagnostic_type_id,
            };

            if (this.selectedClinic) {
                query = {
                    ...query,
                    clinic_id: this.selectedClinic.id,
                };
            }

            if (this.guest) {
                return {
                    name: 'order.choose-diagnostic-time-table',
                    query,
                };
            } else {
                return {
                    name: 'profile.order.choose-diagnostic-time-table',
                    query,
                };
            }
        },
    },
    watch: {
        '$route' (to, from) {
            this.selectedDiagnosticType = null;
            this.selectedClinic = null;
            this.diagnostics = [];
            this.loading = true;

            let query = {};

            if (this.diagnostic_type_id) {
                query = {
                    ...query,
                    diagnostic_type_id: this.diagnostic_type_id,
                };
            }

            if (this.clinic_id) {
                query = {
                    ...query,
                    clinic_id: this.clinic_id,
                };
            }

            if (!this.diagnostic_type_id) {
                if (this.guest) {
                    this.$router.push({
                        name: 'order.find-diagnostic',
                        query,
                    });
                } else {
                    this.$router.push({
                        name: 'profile.order.find-diagnostic',
                        query,
                    });
                }
            }

            this.$store
                .dispatch('getDiagnosticTypes')
                .then(diagnosticTypes => {
                    for (let diagnosticType of diagnosticTypes) {
                        if (diagnosticType.id === Number.parseInt(this.diagnostic_type_id)) {
                            this.selectedDiagnosticType = diagnosticType;
                            break;
                        }
                    }
                });

            this.$store
                .dispatch('getClinics')
                .then(clinics => {
                    for (let clinic of clinics) {
                        if (clinic.id === Number.parseInt(this.clinic_id)) {
                            this.selectedClinic = clinic;
                            break;
                        }
                    }
                });

            this.$store
                .dispatch('getDiagnostics', query)
                .then(diagnostics => {
                    this.diagnostics = diagnostics;
                    this.loading = false;
                });
        }
    },
    mounted() {
        let query = {};

        if (this.diagnostic_type_id) {
            query = {
                ...query,
                diagnostic_type_id: this.diagnostic_type_id,
            };
        }

        if (this.clinic_id) {
            query = {
                ...query,
                clinic_id: this.clinic_id,
            };
        }

        if (!this.diagnostic_type_id) {
            if (this.guest) {
                this.$router.push({
                    name: 'order.find-diagnostic',
                    query,
                });
            } else {
                this.$router.push({
                    name: 'profile.order.find-diagnostic',
                    query,
                });
            }
        }

        this.$store
            .dispatch('getDiagnosticTypes')
            .then(diagnosticTypes => {
                for (let diagnosticType of diagnosticTypes) {
                    if (diagnosticType.id === Number.parseInt(this.diagnostic_type_id)) {
                        this.selectedDiagnosticType = diagnosticType;
                        break;
                    }
                }
            });

        this.$store
            .dispatch('getClinics')
            .then(clinics => {
                for (let clinic of clinics) {
                    if (clinic.id === Number.parseInt(this.clinic_id)) {
                        this.selectedClinic = clinic;
                        break;
                    }
                }
            });

        this.$store
            .dispatch('getDiagnostics', query)
            .then(diagnostics => {
                this.diagnostics = diagnostics;
                this.loading = false;
            });
    },
}
</script>

<style lang="scss" scoped>
.doctor {
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #bfe0ed;

    &:last-child {
        border-bottom: none;
    }

    & .doctor_image_container {
        width: 80px;
        min-width: 80px;

        &>div {
            height: 80px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 50%;
        }
    }

    & .info_container {
        padding-left: 20px;

        &>* {
            margin-bottom: 5px;
        }

        & .name {
            font-size: 18px;
            font-weight: bold;
            color: #0a4766;
        }

        & .description {
            font-size: 15px;
            color: #0a4766;
        }
    }

    & .order_button_container {
        width: 138px;
        min-width: 138px;
    }

    & .info_container,
    & .order_button_container {
        margin-top: 5px;
    }
}

.doctor-not-found-card {
    max-width: 220px;
    padding: 20px;

    box-shadow: 0 2px 4px -1px rgba(163, 190, 204, 0.5), 0 0 0 1px rgba(163, 190, 204, 0.2);
    border-radius: 5px;

    & .header {
        font-size: 15px;
        font-weight: bold;
        color: #0a4766;
        margin-bottom: 10px;
    }

    & .text {
        max-width: 135px;
        font-size: 12px;
        color: #7c98a6;
        margin-bottom: 15px;
    }

    & .phone {
        font-size: 18px;
        color: #0a4766;
    }
}

.header {
    position: relative;

    &>span {
        position: relative;
        top: -7px;
    }
}

.icon__edit {
    display: inline-block;
    background-repeat: no-repeat;
    margin-left: 10px;
    position: relative;
    top: 3px;
}


.transition-loader {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}

.transition-loader-inner {
    transform: translate(-50%);
    left: 50%;
    top: 50%;
    position: absolute;
    width: 100%;
    margin-top: 30px;
    color: #b0e645;
    padding: 0 100px;
    text-align: center;
    label {
        font-size: 1em;
        padding: 1%;
        opacity: 0;
        display: inline-block;
        &:after {
            font-family: FontAwesome;
            content: '\f111';
        }
    }
}

$key-frames-ms: 600ms,
500ms,
400ms,
300ms,
200ms,
100ms;

@each $current-ms in $key-frames-ms {
    $i: index($key-frames-ms, $current-ms);
    .transition-loader-inner label:nth-child(#{$i}) {
        -webkit-animation: loader 3s $current-ms infinite ease-in-out;
        animation: loader 3s $current-ms infinite ease-in-out;
    }
}

@keyframes loader {
    0% {
        opacity: 0;
        transform: translateX(-300px) scale(1);
    }
    33% {
        opacity: 1;
        transform: translateX(0px) scale(2);
    }
    66% {
        opacity: 1;
        transform: translateX(0px) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateX(300px) scale(2);
    }
}

@-webkit-keyframes loader {
    0% {
        opacity: 0;
        -webkit-transform: translateX(-300px);
    }
    33% {
        opacity: 1;
        -webkit-transform: translateX(0px);
    }
    66% {
        opacity: 1;
        -webkit-transform: translateX(0px);
    }
    100% {
        opacity: 0;
        -webkit-transform: translateX(300px);
    }
}
</style>