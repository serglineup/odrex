<template>
    <div class="results">
        <h2 class="profile__header header">
            <div>Пройти диагностику</div>
            <span v-if="selectedDiagnostic" class="diagnostic">
                {{ selectedDiagnostic.title }}
            </span>

            <span v-if="selectedDiagnosticType" class="diagnostic-type">
                Вид диагностики: {{ selectedDiagnosticType.title }}
            </span>

            <span v-if="selectedClinic" class="clinic">
                {{ selectedClinic.short_title }}
            </span>

            <router-link class="icon__edit" :to="routerLinkOrderChooseDiagnostic()"></router-link>
        </h2>

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

                <div class="mb-3" v-if="!loading && time_table_groups.length === 0">
                    Сеансов по данному запросу не найдено
                </div>

                <template v-if="!loading && selectedDiagnosticType && selectedDiagnosticType.can_choose_doctor && doctors && doctors.length > 0">
                    <p>Выберите врача</p>

                    <select class="form-control mb-3" v-model="selected_doctor_id">
                        <option v-for="doctor in doctors" :value="doctor.id">
                            {{ doctor.name }}
                        </option>
                    </select>
                </template>

                <div v-if="!loading && time_table_groups.length !== 0">
                    <p>Выберите дату</p>

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

        <b-modal ref="confirmationModal" centered hide-footer title="Проверьте правильность введённых данных">
            <div v-if="selectedDiagnosticType" class="diagnostic-type">
                <b>Вид диагностики:</b> {{ selectedDiagnosticType.title }}
            </div>

            <div v-if="selectedDiagnostic" class="doctor mt-1">
                {{ selectedDiagnostic.name }}
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
                        <button class="btn" :disabled="selected_time_table_info.is_visited" @click="orderDiagnosticTimeTable">
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
        name: 'order-choose-diagnostic-time-table',
        props: {
            diagnostic_id: {
                required: true,
                type: [Number, String],
            },
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
                selectedDiagnostic: null,
                selectedDiagnosticType: null,
                selectedClinic: null,

                clinics: [],

                selected_time_table: null,
                selected_time_table_info: null,

                doctor_groups: [],
                doctors: [],
                selected_doctor_id: null,

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
                        type: 'diagnostic',
                        service_id: this.selectedDiagnostic.id,
                        time_table_id: this.selected_time_table.id,
                    },
                });
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
                    .dispatch('orderDiagnosticTimeTable', {
                        diagnostic_id: this.selectedDiagnostic.id,
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

            orderDiagnosticTimeTable() {
                this.$store
                    .dispatch('orderDiagnosticTimeTable', {
                        diagnostic_id: this.selectedDiagnostic.id,
                        time_table_id: this.selected_time_table.id,
                    })
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

                if (this.selectedDiagnostic) {
                    this.$store
                        .dispatch('getDiagnosticTimeTableInfo', {
                            diagnostic_id: this.selectedDiagnostic.id,
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
            routerLinkOrderChooseDiagnostic() {
                let query = {};

                if (this.selectedDiagnostic) {
                    query = {
                        ...query,
                        diagnostic_type_id: this.selectedDiagnostic.diagnostic_type_id,
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
                        name: 'order.choose-diagnostic',
                        query,
                    };
                } else {
                    return {
                        name: 'profile.order.choose-diagnostic',
                        query,
                    };
                }
            },
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

            if (!this.diagnostic_id) {
                if (this.guest) {
                    this.$router.push({
                        name: 'order.order-choose-diagnostic',
                        query,
                    });
                } else {
                    this.$router.push({
                        name: 'profile.order.order-choose-diagnostic',
                        query,
                    });
                }
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
                .dispatch('getDiagnostics', query)
                .then(diagnostics => {
                    for (let diagnostic of diagnostics) {
                        if (diagnostic.id === Number.parseInt(this.diagnostic_id)) {
                            this.selectedDiagnostic = diagnostic;
                            break;
                        }
                    }
                });

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
                diagnostic_id: this.diagnostic_id,
            };

            this.$store
                .dispatch('getDiagnosticTimeTables', query)
                .then(({doctorGroups, doctors}) => {
                    this.doctor_groups = doctorGroups;
                    this.doctors = doctors;
                    this.selected_doctor_id = '';
                    this.loading = false;
                });
        },
        watch: {
            selected_doctor_id(value) {
                if (value !== null && this.doctor_groups[value]) {
                    this.time_table_groups = this.doctor_groups[value];
                } else {
                    this.time_table_groups = {};
                }

                this.selected_time_table = null;
                this.selected_time_table_info = null;
            },
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
