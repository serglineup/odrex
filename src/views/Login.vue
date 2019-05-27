<template>
    <div class="login">
        <div class="container-fluid">
            <div class="row content">
                <div class="col-4 align-self-center">
                    <form @submit.prevent="onSubmit" class="form">
                        <Logo/>

                        <h2 class="header-text text-center">
                            Вход для пациентов
                        </h2>

                        <div class="form-group"
                             :class="{ 'invalid': form.data.login !== null && $v.form.data.login.$invalid }">
                             <div class="d-flex justify-content-between">
                                <label for="login">
                                    E-mail | Телефон
                                </label>
                            </div>

                            <input id="login"
                                   type="text"
                                   class="form-control"
                                   v-model="form.data.login">

                        </div>

                        <div class="form-group"
                             :class="{ 'invalid': form.data.password !== null && $v.form.data.password.$invalid }">
                            <div class="d-flex justify-content-between">
                                <label for="password">
                                    Пароль
                                </label>

                                <router-link class="router-link login__forget" :to='{name: "restore-password"}'>
                                    Восстановить пароль
                                </router-link>
                            </div>

                            <input id="password"
                                   type="password"
                                   class="form-control"
                                   v-model="form.data.password">
                        </div>

                        <div class="form-group" v-if='form.errors.need_sms_code'>
                            <label for="sms_code">
                                Код из СМС
                            </label>

                            <input id="sms_code"
                                   type="text"
                                   class="form-control"
                                   v-model="form.data.sms_code">
                        </div>

                        <div v-if="error" class="alert alert-info" role="alert">
                            {{ error }}
                        </div>

                        <div v-if="success" class="alert alert-info" role="alert">
                            {{ success }}
                        </div>

                        <div v-if='form.errors.invalid_credentials' class="alert alert-info" role="alert">
                            Неверный логин или пароль
                        </div>

                        <div v-if='form.errors.invalid_sms_code' class="alert alert-info" role="alert">
                            Неверный код СМС
                        </div>

                        <button type="submit" class="btn btn-primary" :disabled='$v.$invalid || form.sending'>
                            Войти
                        </button>

                        <hr>

                        <div class="text-center footer">
                            Нет учётной записи?
                            <router-link class="router-link" :to='{name:"registration"}'>
                                Зарегистрироваться
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <button type="button" class="close btn-vue-close" aria-label="Close" onclick="toggle_visibility('odrex-vue-wrapper');">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {maxLength, minLength, required} from 'vuelidate/lib/validators';
    import Logo from '../components/Logo';
    import {InvalidCredentialsError, InvalidSmsCodeError, NeedSmsCodeError} from '../api/client/login';
    import {EmailNotConfirmError, PhoneNotConfirmError} from '../api/client/info';

    export default {
        name: 'login',
        props: {
            login: {
                type: String,
                required: false,
            },
        },
        data() {
            return {
                form: {
                    data: {
                        login: this.login || null,
                        password: null,
                        sms_code: null,
                    },
                    errors: {
                        need_sms_code: false,
                        invalid_credentials: false,
                        invalid_sms_code: false,
                    },
                    sending: false,
                },
            };
        },
        computed: {
            ...mapState({
                error: state => state.error,
                success: state => state.success,
            }),
        },
        validations() {
            const validations = {
                form: {
                    data: {
                        login: {
                            required,
                        },
                        password: {
                            required,
                        },
                        sms_code: {
                            minLength: minLength(4),
                            maxLength: maxLength(4),
                        },
                    },
                },
            };

            if (this.form.errors.need_sms_code) {
                validations.form.data.sms_code.required = required;
            }

            return validations;
        },
        methods: {
            onSubmit() {
                this.form.sending = true;

                this.form.errors = {
                    need_sms_code: this.form.errors.need_sms_code,
                    invalid_credentials: false,
                    invalid_sms_code: false,
                };

                this.$store
                    .dispatch('login', this.form.data)
                    .then(() => {
                        this.form.sending = false;

                        this.$router.push({
                            name: 'profile',
                        });
                    })
                    .catch(error => {
                        this.form.sending = false;

                        if (error instanceof EmailNotConfirmError) {
                            this.$router.push({
                                name: 'profile',
                            });
                        }

                        this.form.errors.need_sms_code = error instanceof NeedSmsCodeError;
                        this.form.errors.invalid_credentials = error instanceof InvalidCredentialsError;
                        this.form.errors.invalid_sms_code = error instanceof InvalidSmsCodeError;
                    });
            },
        },
        components: {
            Logo,
        },
        beforeMount() {
            this.$store.dispatch('logout', false);
        },
    }
</script>
