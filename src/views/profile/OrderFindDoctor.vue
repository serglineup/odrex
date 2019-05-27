<template>
    <div class="history">
        <h2 class="profile__header">
            Записаться на консультацию
        </h2>

        <div class="row">
            <div class="col-12 offset-0 col-lg-6 offset-lg-3">
                <div class="history__form">
                    <h4>Специализация врача</h4>
                    <v-select v-model="selectedSpecialization"
                              :options="specializations"
                              :searchable="false"
                              class="userSelect" label="title">
                    </v-select>

                    <template v-if="selectedSpecialization && selectedSpecialization.id">
                        <h4>Выберите клинику</h4>
                        <div class="history__clinic"
                             v-for="clinic in clinics"
                             :class="{ 'history__clinic-active': selectedClinic && clinic.id === selectedClinic.id }"
                             @click="handleChangeClinic(clinic)">
                            <h3>{{ clinic.title }}</h3>
                            <span>{{ clinic.address }}</span>
                        </div>
                    </template>

                    <button class="btn" :disabled="!selectedSpecialization || !selectedSpecialization.id" @click="searchDoctor">
                        Подобрать специалиста
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
        name: 'order-find-doctor',
        props: {
            specialization_id: {
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
                selectedSpecialization: null,
                specializations: [],
                selectedClinic: null,
                clinics: [],
            }
        },
        methods: {
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
            searchDoctor() {
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
                    this.$router.push({
                        name: 'order.choose-doctor',
                        query,
                    })
                } else {
                    this.$router.push({
                        name: 'profile.order.choose-doctor',
                        query,
                    })
                }
            },
        },
        mounted() {
            this.$store
                .dispatch('getSpecializations')
                .then(specializations => {
                    this.selectedSpecialization = {
                        id: null,
                        title: "Выберите специализацию",
                        service_name: "Выберите специализацию"
                    };

                    this.specializations = [];
                    this.specializations.push(this.selectedSpecialization);
                    this.specializations = this.specializations.concat(specializations);

                    for (let specialization of this.specializations) {
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
