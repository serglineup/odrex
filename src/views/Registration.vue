<template>
    <div class="registration">
        <router-link class="arrow-link" :to='{name: "login"}'>
            <i class="icon__arrow"></i>Перейти ко входу
        </router-link>
        <div class="container-fluid">
            <div class="row content">
                <div class="col align-self-center">
                    <div class="row header">
                        <div class="col align-self-center">
                            <Logo/>
                            <h2>Регистрация</h2>
                        </div>
                    </div>
                    <div class="row main">
                        <form @submit.prevent="onSubmit" class="form">
                            <div class="form-group merged" :class="{ 'invalid': form.data.last_name !== null && $v.form.data.last_name.$invalid }">
                                <label for="last_name">
                                    Фамилия <span class="required">*</span>
                                </label>
                                <input id="last_name" type="text" class="form-control" v-model="form.data.last_name">
                            </div>
                            <div class="form-group merged" :class="{ 'invalid': form.data.first_name !== null && $v.form.data.first_name.$invalid }">
                                <label for="first_name">
                                    Имя <span class="required">*</span>
                                </label>
                                <input id="first_name" type="text" class="form-control" v-model="form.data.first_name">
                            </div>
                            <div class="form-group" :class="{ 'invalid': form.data.second_name !== null && $v.form.data.second_name.$invalid }">
                                <label for="second_name">
                                    Отчество
                                </label>
                                <input id="second_name" type="text" class="form-control" v-model="form.data.second_name">
                            </div>
                            <div class="form-group" :class="{ 'invalid': form.data.birthday !== null && $v.form.data.birthday.$invalid }">
                                <label for="birthday">
                                    Дата рождения <span class="required">*</span>
                                </label>
                                <date-input id="birthday" v-model="form.data.birthday"></date-input>
                            </div>
                            <div class="form-group" :class="{ 'invalid': form.data.address !== null && $v.form.data.address.$invalid }">
                                <label for="address">
                                    Адрес <span class="required">*</span>
                                </label>
                                <input id="address" type="text" class="form-control" v-model="form.data.address">
                            </div>
                            <div class="form-group merged" :class="{ 'invalid': form.data.phone !== '' && $v.form.data.phone.$invalid }">
                                <label for="phone">
                                    Номер телефона <span class="required">*</span>
                                </label>
                                <phone-input id="phone" v-model="form.data.phone"></phone-input>
                            </div>
                            <div class="form-group" :class="{ 'invalid': form.data.email !== null && $v.form.data.email.$invalid }">
                                <label for="email">
                                    Email <span class="required">*</span>
                                </label>
                                <input id="email" type="text" class="form-control" v-model="form.data.email">
                            </div>
                            <div class="form-group merged" :class="{ 'invalid': form.data.password !== null && $v.form.data.password.$invalid }">
                                <label for="password">
                                    Пароль <span class="required">*</span>
                                </label>
                                <input id="password" type="password" class="form-control" v-model="form.data.password">
                            </div>
                            <div class="form-group" :class="{ 'invalid': form.data.password_confirmed !== null && $v.form.data.password_confirmed.$invalid }">
                                <label for="password_confirmed">
                                    Повторите пароль <span class="required">*</span>
                                </label>
                                <input id="password_confirmed" type="password" class="form-control" v-model="form.data.password_confirmed">
                            </div>
                            <div class="pretty p-image p-plain">
                                <input id="agree" type="checkbox" v-model="form.data.agree">
                                <div class="state">
                                    <!-- <img class="image" src="../assets/images/yes.png"> -->
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 26 26" width="16" height="16">
                                        <path d="m.3,14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1v-8.88178e-16c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.4 0.4,1 0,1.4l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.5-0.1-0.7-0.3l-7.8-8.4-.2-.3z" fill="#0a4766"/>
                                    </svg>
                                    <label for="agree"></label>
                                </div>
                            </div>
                            <span class="agree">
                                Согласен с <router-link target="_blank" class="router-link" :to="{name: 'rules'}">правилами</router-link>
                            </span>
                            <div v-if="form.errors.duplicate_phone_number_error" class="alert alert-info" role="alert">
                                Номер телефона уже занят
                            </div>
                            <div v-if="form.errors.duplicate_email_error" class="alert alert-info" role="alert">
                                Email уже занят
                            </div>
                            <div v-if="form.errors.sending_registration_email_error" class="alert alert-info" role="alert">
                                Ошибка отправки кода подтверждения. Повторите попытку позднее.
                            </div>
                            <div v-if="form.errors.phone_format_error" class="alert alert-info" role="alert">
                                Неверный формат телефона
                            </div>
                            <button type="submit" class="btn btn-primary" :disabled="$v.$invalid || form.sending || !form.data.agree">
                                Зарегистрироваться
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="close btn-vue-close" aria-label="Close" onclick="toggle_visibility('odrex-vue-wrapper');">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>
<script>
import moment from 'moment';
import { minLength, maxLength, email, sameAs, required } from 'vuelidate/lib/validators';

import Logo from '../components/Logo';
import PhoneInput from '../components/PhoneInput';
import DateInput from '../components/DateInput';
import {
    DuplicatePhoneNumberError,
    DuplicateEmailError,
    SendingRegistrationEmailError,
    PhoneFormatError,
} from '../api/client/register';

export default {
    name: 'registration',
    data() {
        return {
            form: {
                data: {
                    last_name: null,
                    first_name: null,
                    second_name: null,
                    birthday: null,
                    phone: null,
                    login: null,
                    password: null,
                    password_confirmed: null,
                    email: null,
                    address: null,
                    agree: false,
                },
                errors: {
                    duplicate_phone_number_error: false,
                    duplicate_email_error: false,
                    sending_registration_email_error: false,
                    phone_format_error: false,
                },
                sending: false,
            },
        };
    },
    validations() {
        const onlyTextRegexp = /^[а-я\ ]+$/i;
        const onlyTextOrEmptyRegexp = /^[а-я\ ]*$/i;
        const addressTextRegexp = /^[а-я0-9\ \,\.]+$/i;

        return {
            form: {
                data: {
                    last_name: {
                        required,
                        minLength: minLength(2),
                        maxLength: maxLength(80),
                        onlyText(value) {
                            return onlyTextRegexp.test(value);
                        },
                    },
                    first_name: {
                        required,
                        minLength: minLength(2),
                        maxLength: maxLength(80),
                        onlyText(value) {
                            return onlyTextRegexp.test(value);
                        },
                    },
                    second_name: {
                        maxLength: maxLength(80),
                        onlyText(value) {
                            return value == null || onlyTextOrEmptyRegexp.test(value);
                        },
                    },
                    birthday: {
                        required,
                    },
                    address: {
                        required,
                        onlyText(value) {
                            return addressTextRegexp.test(value);
                        },
                    },
                    phone: {
                        required,
                    },
                    email: {
                        required,
                        email,
                    },
                    password: {
                        required,
                        minLength: minLength(8),
                    },
                    password_confirmed: {
                        required,
                        sameAsPassword: sameAs('password'),
                    },
                },
            },
        };
    },
    methods: {
        onSubmit() {
            this.form.errors = {
                duplicate_phone_number_error: false,
                duplicate_email_error: false,
                sending_registration_email_error: false,
                phone_format_error: false,
            };

            this.form.sending = true;

            const { last_name, first_name, second_name, birthday, address, phone, email, login, password } = this.form.data;

            let requestData = {
                name: [last_name, first_name, second_name].join(' '),
                birthday: moment(birthday).format('DD.MM.YYYY'),
                address,
                phone,
                email,
                login,
                password,
            };

            this.$store
                .dispatch('register', requestData)
                .then(({ email, phone }) => {
                    this.form.sending = false;

                    this.$store
                        .dispatch('handleSuccess', 'Регистрация прошла успешно! Зайдите в аккаунт');

                    setTimeout(() => {
                        this.$store.dispatch('clearSuccess');
                    }, 10000);

                    this.$router.push({
                        name: 'login',
                        params: {
                            login: email,
                        }
                    });
                })
                .catch(error => {
                    this.form.sending = false;

                    if (error instanceof DuplicatePhoneNumberError) {
                        this.form.errors.duplicate_phone_number_error = true;
                    }

                    if (error instanceof DuplicateEmailError) {
                        this.form.errors.duplicate_email_error = true;
                    }

                    if (error instanceof SendingRegistrationEmailError) {
                        this.form.errors.sending_registration_email_error = true;
                    }

                    if (error instanceof PhoneFormatError) {
                        this.form.errors.phone_format_error = true;
                    }
                });
        },
    },
    components: {
        Logo,
        DateInput,
        PhoneInput,
    },
}
</script>