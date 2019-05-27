<template>
    <div class="info-change">
        <div class="row">
            <div class="col-6">
                <div class="form-group merged row">
                    <label for="last_name" class="col-form-label col-4 d-flex align-items-center">
                        Фамилия
                    </label>

                    <div class="col-8">
                        <input id="last_name"
                               type="text"
                               class="form-control"
                               v-model="info_change_form.data.last_name" disabled>
                    </div>
                </div>
                <div class="form-group merged row">
                    <label for="first_name" class="col-form-label col-4 d-flex align-items-center">
                        Имя
                    </label>

                    <div class="col-8">
                        <input id="first_name"
                               type="text"
                               class="form-control"
                               v-model="info_change_form.data.first_name" disabled>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="second_name" class="col-form-label col-4 d-flex align-items-center">
                        Отчество
                    </label>

                    <div class="col-8">
                        <input id="second_name"
                               type="text"
                               class="form-control"
                               v-model="info_change_form.data.second_name" disabled>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="info-block">
                    <span class="header">Для внесения изменений обратитесь по номеру</span>
                    <span class="phone">
                        Позвоните:<br/>
                        <a href="tel:0487300030" class="phone">
                            +38 (048) 730-00-30
                        </a>
                    </span>
                </div>
            </div>
        </div>

        <div class="form-group row">
            <label for="birthday" class="col-form-label col-2 d-flex align-items-center">
                День рождения
            </label>
            <div class="col-4">
                <input id="birthday"
                       type="text"
                       class="form-control"
                       v-model="info_change_form.data.birthday" disabled>
            </div>

            <div class="additional-info col-form-label col-4 d-flex align-items-center">
                Возраст: {{ formatDateNow(info_change_form.data.birthday) }}
            </div>
        </div>

        <h3>Контактная информация</h3>

        <div class="form-group merged row">
            <label for="phone" class="col-form-label col-2 d-flex align-items-center">
                Телефон
            </label>

            <div class="col-4">
                <input id="phone"
                       type="text"
                       class="form-control"
                       v-model="info_change_form.data.phone" disabled>
            </div>
        </div>

        <div class="form-group merged row">
            <label for="email" class="col-form-label col-2 d-flex align-items-center">
                E-mail
            </label>

            <div class="col-4">
                <input id="email"
                       type="text"
                       class="form-control"
                       v-model="info_change_form.data.email" disabled>
            </div>
        </div>

        <div class="form-group row">
            <label for="address" class="col-form-label col-2 d-flex align-items-center">
                Адрес
            </label>

            <div class="col-4">
                <textarea id="address"
                          type="text"
                          class="form-control"
                          rows="4"
                          v-model="info_change_form.data.address" disabled></textarea>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {maxLength, required, email} from 'vuelidate/lib/validators';
    import moment from 'moment';
    import config from '../../api/config';

    import DateInput from '../../components/DateInput';
    import PhoneInput from '../../components/PhoneInput';

    export default {
        name: 'info-change',
        data() {
            return {
                info_change_form: {
                    data: {
                        last_name: null,
                        first_name: null,
                        second_name: null,
                        birthday: null,
                        phone: null,
                        email: null,
                        address: null,
                    },
                    errors: {},
                    success: null,
                    sending: false,
                },
            };
        },
        methods: {
            formatDateNow(date) {
                return moment(date).fromNow(true);
            },
        },
        computed: {
            ...mapState({
                user: state => state.auth.user,
            }),
        },
        created() {
            if (this.user) {
                const [last_name = null, first_name = null, second_name = null] = this.user.name.split(' ');

                this.info_change_form.data = {
                    ...this.info_change_form.data,
                    last_name: last_name,
                    first_name: first_name,
                    second_name: second_name,
                    birthday: moment(this.user.birthday).format(config.DATE_FORMAT),
                    phone: this.user.phone,
                    email: this.user.email,
                    address: this.user.address,
                }
            }
        },
    }
</script>

<style lang="scss">
    .info-change {
        padding-top: 30px;

        & > .row {
            margin-bottom: 15px;

            &:last-child {
                margin-top: 20px;
            }

            & > .additional-info {
                font-size: 15px;
                color: #7c98a6;
            }
        }

        & .merged {
            margin-bottom: -1px;

            input {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            & + .form-group {
                input {
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }
                textarea {
                    resize: none;
                }
            }
        }

        & > h3 {
            font-size: 15px;
            font-weight: bold;
            margin-top: 40px;
            margin-bottom: 20px;
        }

        & .info-block {
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

            & .phone {
                font-size: 18px;
                color: #0a4766;
            }
        }
    }
</style>
