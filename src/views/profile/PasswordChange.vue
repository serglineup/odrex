<template>
    <div class="password-change">
        <div class="form-group row"
             :class="{ 'invalid': password_change_form.data.old_password !== null && $v.password_change_form.data.old_password.$invalid }">
            <label for="old_password" class="col-form-label col-2 d-flex align-items-center">
                Старый пароль
            </label>

            <div class="col-4">
                <input id="old_password"
                       type="password"
                       class="form-control"
                       v-model="password_change_form.data.old_password">
            </div>
        </div>

        <div class="form-group row"
             :class="{ 'invalid': password_change_form.data.new_password !== null && $v.password_change_form.data.new_password.$invalid }">
            <label for="new_password" class="col-form-label col-2 d-flex align-items-center">
                Новый пароль
            </label>

            <div class="col-4">
                <input id="new_password"
                       type="password"
                       class="form-control"
                       v-model="password_change_form.data.new_password">
            </div>
        </div>

        <div class="form-group row"
             :class="{ 'invalid': password_change_form.data.confirm_password !== null && $v.password_change_form.data.confirm_password.$invalid }">
            <label for="confirm_password" class="col-form-label col-2 d-flex align-items-center">
                Повторите пароль
            </label>

            <div class="col-4">
                <input id="confirm_password"
                       type="password"
                       class="form-control"
                       v-model="password_change_form.data.confirm_password">
            </div>
        </div>

        <div v-if='password_change_form.errors.invalid_old_password' class="alert alert-danger" role="alert">
            Неверный старый пароль
        </div>

        <div v-if='password_change_form.success' class="alert alert-success" role="alert">
            Новый пароль успешно установлен
        </div>

        <div class="row">
            <div class="button-col offset-2 col-4">
                <button :disabled="$v.password_change_form.$invalid || password_change_form.sending"
                        @click="changePassword"
                        class="btn btn-save w-100">
                    Сохранить изменения
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {maxLength, minLength, required, sameAs} from 'vuelidate/lib/validators';
    import {InvalidPasswordError} from '../../api/client/change-password';

    export default {
        name: 'password-change',
        data() {
            return {
                password_change_form: {
                    data: {
                        old_password: null,
                        new_password: null,
                        confirm_password: null,
                    },
                    errors: {
                        invalid_old_password: false,
                    },
                    success: null,
                    sending: false,
                },
            };
        },
        methods: {
            changePassword() {
                this.password_change_form.sending = true;

                this.password_change_form.errors = {
                    invalid_old_password: false,
                };

                this.$store
                    .dispatch('changePassword', this.password_change_form.data)
                    .then(() => {
                        this.password_change_form.sending = false;
                        this.password_change_form.success = true;

                        this.password_change_form.data = {
                            old_password: null,
                            new_password: null,
                            confirm_password: null,
                        };

                        setTimeout(() => {
                            this.password_change_form.success = null;
                        }, 3000);
                    }, (error) => {
                        this.password_change_form.sending = false;
                        this.password_change_form.success = false;

                        if (error instanceof InvalidPasswordError) {
                            this.password_change_form.errors.invalid_old_password = true;
                        }
                    })
            },
        },
        validations() {
            return {
                password_change_form: {
                    data: {
                        old_password: {
                            required,
                            maxLength: maxLength(64),
                        },
                        new_password: {
                            required,
                            minLength: minLength(8),
                            maxLength: maxLength(64),
                        },
                        confirm_password: {
                            required,
                            sameAs: sameAs('new_password'),
                        },
                    },
                },
            };
        },
    }
</script>

<style lang="scss">
    .password-change {
        padding-top: 30px;

        & > .row {
            margin-bottom: 15px;

            &:last-child {
                margin-top: 20px;
            }
        }
    }
</style>
