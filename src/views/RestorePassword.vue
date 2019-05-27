<template>
    <div class="login">
        <div class="container-fluid">
            <div class="row content">
                <div class="col-4 align-self-center">
                    <form @submit.prevent="onSubmit" class="form">
                        <Logo/>

                        <h2 class="header-text text-center">
                            Восстановление пароля
                        </h2>

                        <div v-if="!send.status" class="form-group"
                             :class="{ 'invalid': form.data.login !== null && $v.form.data.login.$invalid }">
                            <label for="login">
                                Email
                            </label>

                            <input id="login"
                                   type="text"
                                   class="form-control"
                                   v-model="form.data.login">
                        </div>

                        <div v-if="!send.status" class="form-group"
                             :class="{ 'invalid': form.data.phone !== '' && $v.form.data.phone.$invalid }">
                            <label for="phone">
                                Номер телефона
                            </label>

                            <phone-input id="phone" v-model="form.data.phone"></phone-input>
                        </div>

                        <button v-if="!send.status" type="submit" class="btn btn-primary" :disabled="$v.$invalid || form.sending">
                            Отправить
                        </button>

                        <div v-if="send.status" class="alert alert-success text-center" role="alert">
                            Новый пароль отправлен на номер <span v-text="send.phone"></span>
                        </div>

                        <div v-if="form.errors.phone_format_error" class="alert alert-danger" role="alert">
                            Неверный формат телефона
                        </div>

                        <hr>

                        <div class="text-center footer">
                            <router-link class="router-link" :to="{name:'login'}">
                                Перейти ко входу
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
            <button type="button" class="close btn-vue-close" aria-label="Close" onclick="toggle_visibility('odrex-vue-wrapper');">
                <span aria-hidden="true">&times;</span>
            </button>            
        </div>
    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators';
    import Logo from '../components/Logo';

    import PhoneInput from '../components/PhoneInput';
    import {PhoneFormatError} from '../api/client/restore-password';

    export default {
        name: 'restore-password',
        data() {
            return {
                form: {
                    data: {
                        login: null,
                        phone: null,
                    },
                    errors: {
                        phone_format_error: false,
                    },
                    sending: false,
                },
                send: {
                    status: false,
                    phone: null,
                },
            }
        },
        validations() {
            return {
                form: {
                    data: {
                        login: {
                            required,
                        },
                        phone: {
                            required,
                        },
                    },
                },
            };
        },
        methods: {
            onSubmit() {
                this.form.errors = {
                    phone_format_error: false,
                };

                this.form.sending = true;

                this.$store
                    .dispatch('restorePassword', this.form.data)
                    .then(() => {
                        this.form.sending = false;

                        this.send.status = true;
                        this.send.phone = this.form.data.phone;

                        this.form.login = null;
                        this.form.phone = null;
                    })
                    .catch(error => {
                        if (error instanceof PhoneFormatError) {
                            this.form.sending = false;

                            this.send.status = false;

                            this.form.errors.phone_format_error = true;
                        } else {
                            this.form.sending = false;

                            this.send.status = true;
                            this.send.phone = this.form.data.phone;

                            this.form.login = null;
                            this.form.phone = null;
                        }
                    });
            },
        },
        components: {
            Logo,
            PhoneInput,
        },
    }
</script>
