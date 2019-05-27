<template>
    <div class="history">
        <h2 class="profile__header">
            Пройти диагностику
        </h2>

        <div class="row">
            <div class="col-12 offset-0 col-lg-6 offset-lg-3">
                <div class="history__form">
                    <h4>Тип диагностики</h4>
                    <v-select v-model="selectedDiagnosticType"
                              :options="diagnosticTypes"
                              :searchable="false"
                              class="userSelect" label="title">
                    </v-select>

                    <template v-if="selectedDiagnosticType && selectedDiagnosticType.id">
                        <h4>Выберите клинику</h4>
                        <div class="history__clinic"
                             v-for="clinic in availableClinics"
                             :class="{ 'history__clinic-active': selectedClinic && clinic.id === selectedClinic.id }"
                             @click="handleChangeClinic(clinic)">
                            <h3>{{ clinic.title }}</h3>
                            <span>{{ clinic.address }}</span>
                        </div>
                    </template>

                    <button class="btn"
                            :disabled="!selectedDiagnosticType || !selectedDiagnosticType.id"
                            @click="searchDiagnostic">
                        Перейти к выбору диагностики
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import config from '../../api/config';

    export default {
        name: 'order-find-diagnostic',
        props: {
            diagnostic_type_id: {
                required: false,
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
                diagnosticTypes: [],
                selectedClinic: null,
                clinics: [],
                availableClinics: [],
            }
        },
        watch: {
            selectedDiagnosticType(value) {
                this.selectedClinic = null;
                this.availableClinics = this.getDiagnosticTypeClinics(value);
            }
        },
        methods: {
            getDiagnosticTypeClinics(diagnosticType) {
                if (diagnosticType && diagnosticType.clinics) {
                    let clinics = this.clinics.filter(clinic => {
                        return diagnosticType.clinics.includes(clinic.id);
                    });

                    if (clinics.length === 1) {
                        this.selectedClinic = clinics[0];
                    }

                    return clinics;
                }

                return [];
            },
            formatDate(date) {
                return moment(date).format(config.DATE_FORMAT_OUTPUT);
            },
            handleChangeClinic(clinic) {
                if (clinic === this.selectedClinic) {
                    this.selectedClinic = null;
                } else {
                    this.selectedClinic = clinic;
                }
            },
            searchDiagnostic() {
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
                    this.$router.push({
                        name: 'order.choose-diagnostic',
                        query,
                    })
                } else {
                    this.$router.push({
                        name: 'profile.order.choose-diagnostic',
                        query,
                    })
                }
            },
        },
        mounted() {
            this.$store
                .dispatch('getDiagnosticTypes')
                .then(diagnosticTypes => {
                    this.selectedDiagnosticType = {
                        id: null,
                        title: "Выберите тип диагностики",
                        service_name: "Выберите тип диагностики"
                    };

                    this.diagnosticTypes = [];
                    this.diagnosticTypes.push(this.selectedDiagnosticType);
                    this.diagnosticTypes = this.diagnosticTypes.concat(diagnosticTypes);

                    for (let diagnosticType of this.diagnosticTypes) {
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

                    for (let clinic of this.clinics) {
                        if (clinic.id === Number.parseInt(this.clinic_id)) {
                            this.selectedClinic = clinic;
                            break;
                        }
                    }
                });
        },
        components: {},
    }
</script>
