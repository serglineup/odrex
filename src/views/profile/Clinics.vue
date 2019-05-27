<template>
    <div class="clinics">
        <h2>Клиники</h2>

        <div class="row">
            <div class="col-12 d-flex flex-row">
                <div class="history__clinic col"
                     v-for="clinic in clinics"
                     :class="{ 'history__clinic-active': selectedClinic && clinic.id === selectedClinic.id }"
                     @click="handleChangeClinic(clinic)">
                    <h3>{{ clinic.title }}</h3>
                    <span>{{ clinic.address }}</span>
                </div>
            </div>
        </div>

        <GmapMap v-if="selectedClinic"
                 :center="{lat:selectedClinic.latitude, lng:selectedClinic.longitude}"
                 :zoom="16"
                 style="width: 100%; height: 400px">
            <GmapMarker :key="clinic.id"
                        v-for="clinic in clinics"
                        :position="{lat:clinic.latitude, lng:clinic.longitude}">
            </GmapMarker>
        </GmapMap>
    </div>
</template>

<script>
    export default {
        name: 'clinics',
        data() {
            return {
                selectedClinic: null,
                clinics: [],
            };
        },
        methods: {
            handleChangeClinic(clinic) {
                this.selectedClinic = clinic;
            },
        },
        mounted() {
            this.$store
                .dispatch('getClinics')
                .then(clinics => {
                    this.clinics = clinics;
                    this.selectedClinic = clinics[0];
                });
        },
    }
</script>

<style lang="scss">
    .clinics {
        margin-bottom: 15px;

        & > h2 {
            font-size: 42px;
            color: #0a4766;
            margin-top: 25px;
            margin-bottom: 15px;
        }
    }
</style>
