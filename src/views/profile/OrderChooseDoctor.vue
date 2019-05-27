<template>
    <div class="results">
        <h2 class="profile__header header">
            <div>Записаться на консультацию</div>
            <span>Результаты поиска</span>

            <span v-if="selectedSpecialization" class="specialization">
                {{ selectedSpecialization.title }}
            </span>

            <span v-if="selectedClinic" class="clinic">
                {{ selectedClinic.short_title }}
            </span>

            <router-link class="icon__edit" :to="routerLinkOrderFindDoctor()"></router-link>
        </h2>
        <div class="col-12">
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
                    <div v-if="!loading && doctors.length === 0">
                        К сожалению, нам не удалось найти соответствующих специалистов по вашему запросу. Вы можете:

                        <ul class="variants">
                            <li class="my-2 ml-4">
                                <router-link :to="routerLinkOrderChooseDoctorWithoutAddress()">
                                    Подобрать врача по другому адресу
                                </router-link>
                            </li>
                            <li class="my-2 ml-4">
                                <router-link :to="routerLinkOrderFindDoctor()">
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
                    <div v-for="doctor in doctors" class="doctor-container d-flex flex-row align-items-stretch">
                        <div class="doctor_image_container">
                            <div :style="doctorAvatarStyle(doctor)"></div>
                        </div>
                        <div class="info_container flex-grow-1">
                            <div class="name">{{ doctor.name }}</div>
                            <div class="description">{{ doctor.description }}</div>
                        </div>
                        <div class="order_button_container">
                            <router-link v-if="doctor.clinics.length > 0 && doctor.is_scheduled" class="btn" :to="routerLinkOrderChooseDoctorTimeTable(doctor)">
                                Записаться
                            </router-link>
                            <a v-if="doctor.link" :href="doctor.link" class="p-btn p-btn-grey p-btn-block">Подробнее</a>

                            <p v-if="doctor.clinics.length === 0 && doctor.is_scheduled">
                                Нет доступных сеансов
                            </p>

                            <p v-if="!doctor.is_scheduled">
                                Запись по телефону
                                <!--<button class="btn" @click="openOrderDoctorModal(doctor)">-->
                                    <!--Записаться-->
                                <!--</button>-->
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-4" v-if="!loading">
                    <div class="doctor-not-found-card card">
                        <span class="header">Не получается самостоятельно найти врача?</span>
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

        <b-modal ref="orderDoctorModal" centered hide-footer title="Введите информацию">
            <div v-if="selectedSpecialization" class="specialization">
                <b>Специализация:</b> {{ selectedSpecialization.title }}
            </div>

            <div v-if="orderDoctor" class="doctor mt-1">
                {{ orderDoctor.name }}
            </div>

            <datepicker input-class="form-control"
                        format="dd.MM.yyyy"
                        :full-month-name="true"
                        :language="datepicker_language"
                        :disabled-dates="disabledDates"
                        initialView="day"
                        :mondayFirst="true"
                        maximum-view="day"
                        :inline="true"
                        v-model="orderDoctorDate">
            </datepicker>

            <vue-timepicker
                    format="HH:mm"
                    :minute-interval="5"
                    hide-clear-button
                    v-model="orderDoctorTime">
            </vue-timepicker>

            <div class="mt-3" v-if="orderDoctor">
                <button class="btn" :disabled="orderDoctorDate == null" @click="closeOrderDoctorModal()">
                    Записаться
                </button>
            </div>

            <div class="mt-1 text-center">
                <button class="btn btn-link btn-link-clear" @click="closeOrderDoctorModal()">
                    Отмена
                </button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
import {ru} from 'vuejs-datepicker/dist/locale'
import VueTimepicker from 'vue2-timepicker'
import moment from 'moment';

export default {
    name: 'order-choose-doctor',
    props: {
        specialization_id: {
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
            datepicker_language: ru,

            selectedSpecialization: null,
            selectedClinic: null,
            doctors: [],
            loading: true,

            orderDoctor: null,
            orderDoctorDate: null,
            orderDoctorTime: {
                HH: "00",
                mm: "00",
            },
        }
    },
    methods: {
        openOrderDoctorModal(doctor) {
            this.orderDoctor = doctor;
            this.$refs.orderDoctorModal.show();
        },
        closeOrderDoctorModal() {
            this.$refs.orderDoctorModal.hide();
            this.orderDoctor = null;
        },
        routerLinkOrderFindDoctor() {
            let query = {};

            if (this.selectedSpecialization) {
                query = {
                    ...query,
                    specialization_id: this.selectedSpecialization.id,
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
                    name: 'order.find-doctor',
                    query,
                };
            } else {
                return {
                    name: 'profile.order.find-doctor',
                    query,
                };
            }
        },
        routerLinkOrderChooseDoctorWithoutAddress() {
            let query = {};

            if (this.selectedSpecialization) {
                query = {
                    ...query,
                    specialization_id: this.selectedSpecialization.id,
                };
            }

            if (this.guest) {
                return {
                    name: 'order.choose-doctor',
                    query,
                };
            } else {
                return {
                    name: 'profile.order.choose-doctor',
                    query,
                };
            }
        },
        routerLinkOrderChooseDoctorTimeTable(doctor) {
            let query = {
                doctor_id: doctor.id,
            };

            if (this.selectedSpecialization) {
                query = {
                    ...query,
                    specialization_id: this.selectedSpecialization.id,
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
                    name: 'order.choose-doctor-time-table',
                    query,
                };
            } else {
                return {
                    name: 'profile.order.choose-doctor-time-table',
                    query,
                };
            }
        },
        doctorAvatarStyle(doctor) {
            let backgroundImage = 'url("https://odrex.space/images/user-placeholder.png")';

            if (doctor.image) {
                backgroundImage = `url(${doctor.image})`;
            }

            return {
                backgroundImage,
            };
        },
    },
    watch: {
        '$route' (to, from) {
            this.selectedSpecialization = null;
            this.selectedClinic = null;
            this.doctors = [];
            this.loading = true;

            let query = {};

            if (this.specialization_id) {
                query = {
                    ...query,
                    specialization_id: this.specialization_id,
                };
            }

            if (this.clinic_id) {
                query = {
                    ...query,
                    clinic_id: this.clinic_id,
                };
            }

            if (!this.specialization_id) {
                if (this.guest) {
                    this.$router.push({
                        name: 'order.find-doctor',
                        query,
                    });
                } else {
                    this.$router.push({
                        name: 'profile.order.find-doctor',
                        query,
                    });
                }
            }

            this.$store
                .dispatch('getSpecializations')
                .then(specializations => {
                    for (let specialization of specializations) {
                        if (specialization.id === Number.parseInt(this.specialization_id)) {
                            this.selectedSpecialization = specialization;
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
                .dispatch('getDoctors', query)
                .then(doctors => {
                    this.doctors = doctors;
                    this.loading = false;
                });
        }
    },
    computed: {
        disabledDates() {
            return {
                customPredictor: (date) => {
                    let now = moment(new Date()).hours(0).minutes(0).seconds(0);
                    return moment(date) < now;
                },
            };
        },
    },
    mounted() {
        let query = {};

        if (this.specialization_id) {
            query = {
                ...query,
                specialization_id: this.specialization_id,
            };
        }

        if (this.clinic_id) {
            query = {
                ...query,
                clinic_id: this.clinic_id,
            };
        }

        if (!this.specialization_id) {
            if (this.guest) {
                this.$router.push({
                    name: 'order.find-doctor',
                    query,
                });
            } else {
                this.$router.push({
                    name: 'profile.order.find-doctor',
                    query,
                });
            }
        }

        this.$store
            .dispatch('getSpecializations')
            .then(specializations => {
                for (let specialization of specializations) {
                    if (specialization.id === Number.parseInt(this.specialization_id)) {
                        this.selectedSpecialization = specialization;
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
            .dispatch('getDoctors', query)
            .then(doctors => {
                this.doctors = doctors;
                this.loading = false;
            });
    },
    components: {
        Datepicker,
        VueTimepicker,
    },
}
</script>

<style lang="scss" scoped>
.doctor-container {
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
</style>