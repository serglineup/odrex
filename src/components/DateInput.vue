<template>
    <div class="date-input">
        <datepicker :id="id"
                    ref="birthday_picker"
                    input-class="form-control"
                    format="dd.MM.yyyy"
                    :language="datepicker_language"
                    :initialView="initialView"
                    :mondayFirst="true"
                    :value="value"
                    @input="input">
        </datepicker>

        <i class="fa fa-calendar"
           @click="$refs.birthday_picker.$children[0].$emit('showCalendar')"></i>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import {ru} from 'vuejs-datepicker/dist/locale'

    export default {
        name: 'date-input',
        props: {
            id: {
                type: String,
                required: false,
                default: '',
            },
            value: {
                required: false,
                default: null,
            },
            initialView: {
                type: String,
                required: false,
                default: 'year',
            },
        },
        data() {
            return {
                datepicker_language: ru,
            };
        },
        methods: {
            input(value) {
                this.$emit('input', value);
            },
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
