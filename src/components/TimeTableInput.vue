<template>
    <div class="time-table-input">
        <div class="select">
            <input type="text"
                   class="form-control"
                   placeholder="Выберите дату и время посещения"
                   :value="selected_time_table_value"
                   disabled="disabled"
                   @click="show_modal = true">
        </div>

        <div class="modal-select d-flex" v-show="show_modal">
            <div class="d-flex flex-column">
                <span class="time-table-span w-100">Выберите дату</span>
                <datepicker input-class="form-control"
                            format="dd.MM.yyyy"
                            :full-month-name="true"
                            :language="datepicker_language"
                            :disabled-dates="disabledDates"
                            initialView="day"
                            :mondayFirst="true"
                            maximum-view="day"
                            :inline="true"
                            v-model="time_table_date">
                </datepicker>
            </div>
            <div class="d-flex flex-column">
                <span class="time-table-span w-100">и комфортное время посещения</span>
                <div class="w-100 time-tables d-flex flex-wrap align-content-start">
                    <template v-if="chooseClinic">
                        <div v-for="clinic in sorted_clinics" v-if="Object.keys(timeTables(clinic.id)).length > 0">
                            <p>{{ clinic.title }}</p>
                            <div class="time-tables-wrapper d-flex flex-wrap">
                                <div class="time-table" v-for="time_table in timeTables(clinic.id)">
                                    <button class="btn btn-blue btn-sm" :class="{'active': selected_time_table === time_table}"
                                            v-if="!(time_table.is_visited || time_table.start < new Date())"
                                            @click="chooseTimeTable(time_table)">
                                        {{ formatTime(time_table.start) }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="!chooseClinic">
                        <div class="time-tables-wrapper d-flex flex-wrap">
                            <div class="time-table" v-for="time_table in timeTables()">
                                <button class="btn btn-blue btn-sm" :class="{'active': selected_time_table === time_table}"
                                        v-if="!(time_table.is_visited || time_table.start < new Date())"
                                        @click="chooseTimeTable(time_table)">
                                    {{ formatTime(time_table.start) }}
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import {ru} from 'vuejs-datepicker/dist/locale'
    import moment from 'moment';
    import config from '../api/config';

    export default {
        name: 'time-table-input',
        props: {
            time_table_groups: {
                required: true,
            },
            clinics: {
                required: false,
                default: () => [],
            },
            chooseClinic: {
                required: false,
                default: () => false,
            },
        },
        data() {
            return {
                datepicker_language: ru,
                sorted_clinics: [],

                show_modal: false,

                time_table_keys: Object.keys(this.time_table_groups),
                time_table_date: null,

                selected_time_table: null,
                selected_time_table_info: null,
                selected_time_table_value: null,
            };
        },
        methods: {
            formatTime(date) {
                return moment(date).format('HH:mm');
            },
            chooseTimeTable(timeTable) {
                this.selected_time_table = timeTable;
                this.selected_time_table_info = null;

                this.selected_time_table_value = moment(timeTable.start).format(config.DATE_TIME_FORMAT_SHORT);

                this.show_modal = false;

                this.$emit('input', timeTable);
            },
            timeTables(clinic_id = null) {
                if (this.time_table_date === null) {
                    return [];
                }

                let dateKey = moment(this.time_table_date).format('DD.MM.YYYY');

                var timeTables = this.time_table_groups[dateKey];

                if (clinic_id == null) {
                    return timeTables;
                }

                var filteredTimeTables = {};

                for (var index in timeTables) {
                    var timeTable = timeTables[index];

                    if (timeTable.clinic_id === clinic_id) {
                        filteredTimeTables[index] = timeTable;
                    }
                }

                return filteredTimeTables;
            },
        },
        computed: {
            disabledDates() {
                return {
                    customPredictor: (date) => {
                        let dateKey = moment(date).format('DD.MM.YYYY');
                        return this.time_table_keys.indexOf(dateKey) === -1;
                    },
                };
            },
        },
        watch: {
            time_table_groups(value) {
                this.time_table_keys = Object.keys(this.time_table_groups);
            },
            time_table_date(value) {
                let dateKey = moment(value).format('DD.MM.YYYY');

                let timeTables = Object.values(this.time_table_groups[dateKey]);

                this.sorted_clinics = this.clinics.sort((a, b) => {
                    let aCount = timeTables
                        .filter(time_table_group => {
                            return time_table_group.clinic_id === a.id;
                        })
                        .length;

                    let bCount = timeTables
                        .filter(time_table_group => {
                            return time_table_group.clinic_id === b.id;
                        })
                        .length;

                    return bCount - aCount;
                });
            }
        },
        components: {
            Datepicker,
        },
    }
</script>

<style lang="scss" scoped>
    .date-input {
        position: relative;

        & > .fa {
            cursor: pointer;
            position: absolute;
            font-size: 20px;
            top: 14px;
            right: 14px;
        }
    }
</style>
