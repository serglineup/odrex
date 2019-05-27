<template>
    <div class="results">
        <h2 class="profile__header header">
            <div>Записаться на консультацию</div>
            <span v-if="selectedDoctor" class="doctor">
                {{ selectedDoctor.name }}
            </span>

            <span v-if="selectedSpecialization" class="specialization">
                {{ selectedSpecialization.title }}
            </span>

            <span v-if="selectedClinic" class="clinic">
                {{ selectedClinic.short_title }}
            </span>

            <router-link class="icon__edit" :to="routerLinkOrderChooseDoctor()"></router-link>
        </h2>

        <div class="col-12">
            <div class="row">
            <div class="col-8">
                <div v-if="loading">
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

                <div v-if="!loading && time_table_groups.length === 0">
                    Сеансов по данному запросу не найдено
                </div>

                <div  v-if="!loading && time_table_groups.length !== 0">
                    <time-table-input v-if="time_table_groups && clinics"
                                      :time_table_groups="time_table_groups"
                                      :clinics="clinics"
                                      :choose-clinic="selectedClinic == null"
                                      @input="onSelectTimeTable"></time-table-input>
                        <button class="btn btn-inline pull-right"
                                :disabled="!selected_time_table_info"
                                @click="openConfirmationModal">
                            Подтвердить
                        </button>                                      

                    <div class="mt-3">
                    </div>
                </div>
            </div>

            <div class="col-4" v-if="!loading">
                <div class="doctor-not-found-card card">
                    <span class="header">Нет подходящего времени?</span>

                    <span class="text">Позвоните на горячую линию Odrex и спросите у оператора</span>

                    <span class="phone">+38 (048) 730-00-30</span>
                </div>
            </div>
        </div>            
        </div>

        <b-modal ref="confirmationModal" centered hide-footer title="Проверьте правильность введённых данных">
            <div v-if="selectedSpecialization" class="specialization">
                <b>Специализация:</b> {{ selectedSpecialization.title }}
            </div>

            <div v-if="selectedDoctor" class="doctor mt-1">
                {{ selectedDoctor.name }}
            </div>

            <div v-if="selectedClinic" class="clinic mt-1">
                <b>Отделение:</b> {{ selectedClinic.title }}
            </div>

            <div v-if="selected_time_table" class="mt-1">
                <b>Дата и время сеанса:</b> {{ formatTime(selected_time_table.start, 'D MMM YYYY') }}
                с {{ formatTime(selected_time_table.start, 'HH:mm') }}
                до {{ formatTime(selected_time_table.end, 'HH:mm') }}
            </div>

            <div v-if="selected_time_table_info" class="mt-1">
                <b>Стоимость посещения:</b> {{ selected_time_table_info.price }} грн.
            </div>

            <div v-if="selected_time_table_info && selected_time_table_info.is_visited" class="mt-1">
                <b>К сожалению, данный сеанс уже занят</b>
            </div>
            <template v-else>
                <template v-if="!guest">
                    <div class="mt-3" v-if="selected_time_table_info">
                        <button class="btn" :disabled="selected_time_table_info.is_visited" @click="orderDoctorTimeTable">
                            Оплатить посещение сейчас онлайн
                        </button>
                    </div>

                    <div class="mt-1" v-if="selected_time_table_info">
                        <button class="btn" @click="callOperator">
                            Оплатить посещение на месте
                        </button>
                    </div>
                </template>
                <template v-else>
                    <div class="mt-3" v-if="selected_time_table_info">
                        <button class="btn" :disabled="selected_time_table_info.is_visited" @click="orderGuest">
                            Подтвердить
                        </button>
                    </div>
                </template>
            </template>

            <template v-if="!guest">
                <div class="mx-2">
                    <span class="text-danger">*</span>
                    При оплате онлайн время резервации сеанса составляет <b>20 минут</b>, после чего бронь будет аннулирована.
                </div>
            </template>

            <div v-if="selected_time_table_info" class="mt-1 text-center">
                <button class="btn btn-link btn-link-clear" @click="cancelTimeTable()">
                    <template v-if="selected_time_table_info.is_visited">Закрыть</template>
                    <template v-else>Отмена</template>
                </button>
            </div>
        </b-modal>

        <b-modal ref="operatorModal" @hide="navigateProfile" centered hide-footer title="Уведомление">
            <p>Ожидайте звонка оператора</p>

            <div class="mt-3">
                <button class="btn btn-sm btn-green" @click="closeOperatorModal()">
                    Жду звонка
                </button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import config from '../../api/config';
    import TimeTableInput from '../../components/TimeTableInput'

    export default {
        name: 'order-choose-doctor-time-table',
        props: {
            doctor_id: {
                required: true,
                type: String,
            },
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
                selectedDoctor: null,
                selectedSpecialization: null,
                selectedClinic: null,

                clinics: [],

                selected_time_table: null,
                selected_time_table_info: null,

                time_table_groups: [],
                order_info: null,

                loading: true,
                pay_form: null,
            }
        },
        methods: {
            orderGuest() {
                this.$router.push({
                    name: 'order.guest',
                    query: {
                        type: 'specialization',
                        service_id: this.selectedSpecialization.id,
                        time_table_id: this.selected_time_table.id,
                        doctor_id: this.selected_time_table.doctor_id,
                    },
                })
            },
            cancelTimeTable() {
                this.$refs.confirmationModal.hide();
            },

            closeOperatorModal() {
                this.$refs.operatorModal.hide();
            },

            navigateProfile() {
                if (!this.guest) {
                    this.$router.push({
                        name: 'profile',
                    });
                }
            },

            callOperator() {
                this.$store
                    .dispatch('orderDoctorTimeTable', {
                        specialization_id: this.selectedSpecialization.id,
                        doctor_id: this.selectedDoctor.id,
                        time_table_id: this.selected_time_table.id,
                        pay: 0,
                    })
                    .then(order_info => {
                        this.order_info = order_info;
                        this.$refs.confirmationModal.hide();

                        this.$refs.operatorModal.show();

                        this.onSelectTimeTable(this.selected_time_table);

                        this.$store
                            .dispatch('getVisitsCurrent');

                        this.$store
                            .dispatch('updateInfo');
                    });
            },
            orderDoctorTimeTable() {
                this.$store
                    .dispatch('orderDoctorTimeTable', {
                        specialization_id: this.selectedSpecialization.id,
                        doctor_id: this.selectedDoctor.id,
                        time_table_id: this.selected_time_table.id,
                    })
                    .then(({data: {enter_url, params}}) => {
                        console.log(enter_url, params);

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

                        this.onSelectTimeTable(this.selected_time_table);

                        this.$store
                            .dispatch('getVisitsCurrent');

                        this.$store
                            .dispatch('updateInfo');
                    });
            },
            submitOrder() {
                this.$refs.successOrderModal.hide();
                this.onSelectTimeTable(this.selected_time_table);
            },
            onSelectTimeTable(timeTable) {
                this.selected_time_table = timeTable;
                this.selected_time_table_info = null;

                if (this.selectedDoctor && this.selectedSpecialization) {
                    this.$store
                        .dispatch('getDoctorTimeTableInfo', {
                            doctor_id: this.selectedDoctor.id,
                            specialization_id: this.selectedSpecialization.id,
                            time_table_id: timeTable.id,
                        })
                        .then(timeTableInfo => {
                            this.selected_time_table_info = timeTableInfo;
                        })
                }
            },
            openConfirmationModal() {
                this.$refs.confirmationModal.show();
            },
            formatTime(date, format = 'HH:mm') {
                return moment(date).format(format);
            },
            routerLinkOrderChooseDoctor() {
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

            if (!this.doctor_id) {
                if (this.guest) {
                    this.$router.push({
                        name: 'order.order-choose-doctor',
                        query,
                    });
                } else {
                    this.$router.push({
                        name: 'profile.order.order-choose-doctor',
                        query,
                    });
                }
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
                .dispatch('getDoctors', query)
                .then(doctors => {
                    for (let doctor of doctors) {
                        if (doctor.id === this.doctor_id) {
                            this.selectedDoctor = doctor;
                            break;
                        }
                    }
                });

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
                    this.clinics = clinics;

                    for (let clinic of clinics) {
                        if (clinic.id === Number.parseInt(this.clinic_id)) {
                            this.selectedClinic = clinic;
                            break;
                        }
                    }
                });

            query = {
                ...query,
                doctor_id: this.doctor_id,
            };

            this.$store
                .dispatch('getDoctorTimeTables', query)
                .then(time_table_groups => {
                    this.time_table_groups = time_table_groups;
                    this.loading = false;
                });
        },
        components: {
            TimeTableInput,
        },
    }
</script>

<style lang="scss" scoped>
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

        & > span {
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

    .time-table {
        & button {
            width: 120px;
            margin-right: 30px;
            margin-bottom: 15px;
        }
    }
</style>
