<template>
    <div class="results">
    	<h2 class="profile__header">
		    Ваши данные
		</h2>
        <div class="row">
            <div class="col-6">
                <div class="form-group merged row" :class="{'invalid': errors['name'] && errors['name'].length > 0}">
                    <div class="col-8">
                        <input type="text"
                               class="form-control"
                               placeholder="ФИО"
                               v-model="form.data.name">
                    </div>
                </div>

                <div class="form-group merged row" :class="{'invalid': errors['phone'] && errors['phone'].length > 0}">
                    <div class="col-8">
                        <phone-input v-model="form.data.phone">
                        </phone-input>
                    </div>
                </div>

                <div class="form-group row" :class="{'invalid': errors['birthday'] && errors['birthday'].length > 0}">
                    <div class="col-8">
                        <date-input v-model="form.data.birthday"></date-input>
                    </div>
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
                <span style="font-size: 13px;">У меня уже есть личный кабинет Odrex</span>	                                  

                <div class="form-group row mt-3">
                    <div class="col-8">
                        <button class="btn btn-green"
                                :disabled="$v.form.data.$invalid"
                                :style="{'display': success === true ? 'none' : 'block'}"
                                @click="order">
                            Подтвердить
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-6">
            	<div class="d-flex justify-content-end">
            		<div class="col-10">
            			<div class="card">
		            		<h4>Личный кабинет Odrex</h4>
		            		<span>Преимущества кабинета</span>
		            		<ul>
		            			<li>Списки анализов</li>
		            			<li>История болезни</li>
		            			<li>Быстрый доступ к консультациям</li>
		            		</ul>
		            		
		            		<router-link class="btn btn-green" :to='{name:"registration"}'>
                                Регистрация кабинета
                            </router-link>
		                </div>
            		</div>
            	</div>
            </div>            
        </div>

        <b-modal v-model="success" @hide="closeConfirmationModal" centered hide-footer title="Подтверждение" no-close-on-backdrop>
            <p>Введите код из смс</p>

            <div class="form-group">
                <input type="text"
                       v-model="confirmForm.data.sms">
            </div>

            <p v-if="confirmForm.errors.sms">Неправильный sms код</p>

            <div class="mt-3 text-center">
                <button class="btn btn-sm btn-green"
                        :disabled="$v.confirmForm.data.$invalid"
                        @click="confirm">
                    Подтвердить
                </button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import PhoneInput from "../../components/PhoneInput";
    import {maxLength, minLength, required} from 'vuelidate/lib/validators';
    import DateInput from "../../components/DateInput";
    import moment from 'moment';
    import {InvalidSmsCodeOrTokenError} from '../../api/orders/errors'

    export default {
        name: 'order-guest',
        components: {
            DateInput,
            PhoneInput
        },
        props: {
            type: {
                required: true,
                type: [String],
            },
            service_id: {
                required: true,
                type: [Number, String],
            },
            time_table_id: {
                required: true,
                type: [Number, String],
            },
            doctor_id: {
                required: false,
                type: [String],
            },
        },
        data() {
            return {
                form: {
                    data: {
                        name: null,
                        phone: null,
                        birthday: null,
                        agree: false
                    },
                },
                confirmForm: {
                    data: {
                        sms: null,
                    },
                    errors: {
                        sms: false,
                    },
                },
                errors: {},
                orderData: null,
                success: null,
            }
        },
        methods: {
            closeConfirmationModal() {
                this.success = null;
            },
            confirm() {
                this.confirmForm.errors.sms = false;

                switch (this.type) {
                    case 'specialization':
                        this.$store
                            .dispatch('confirmGuestDoctorTimeTable', {
                                doctor_id: this.doctor_id,
                                specialization_id: this.service_id,
                                time_table_id: this.time_table_id,
                                id: this.orderData.id,
                                token: this.orderData.token,
                                sms: this.confirmForm.data.sms,
                            })
                            .then(this.handleConfirmOrder)
                            .catch(this.handleConfirmError);
                        break;
                    case 'diagnostic':
                        this.$store
                            .dispatch('confirmGuestDiagnosticTimeTable', {
                                diagnostic_id: this.service_id,
                                time_table_id: this.time_table_id,
                                id: this.orderData.id,
                                token: this.orderData.token,
                                sms: this.confirmForm.data.sms,
                            })
                            .then(this.handleConfirmOrder)
                            .catch(this.handleConfirmError);
                        break;
                }
            },
            order() {
                this.errors = {};

                switch (this.type) {
                    case 'specialization':
                        this.$store
                            .dispatch('orderGuestDoctorTimeTable', {
                                doctor_id: this.doctor_id,
                                specialization_id: this.service_id,
                                time_table_id: this.time_table_id,
                                name: this.form.data.name,
                                phone: this.form.data.phone,
                                birthday: moment(this.form.data.birthday).format('DD.MM.YYYY'),
                                pay: 0,
                            })
                            .then(this.handleOrder)
                            .catch(this.handleError);
                        break;
                    case 'diagnostic':
                        this.$store
                            .dispatch('orderGuestDiagnosticTimeTable', {
                                diagnostic_id: this.service_id,
                                time_table_id: this.time_table_id,
                                name: this.form.data.name,
                                phone: this.form.data.phone,
                                birthday: moment(this.form.data.birthday).format('DD.MM.YYYY'),
                                pay: 0,
                            })
                            .then(this.handleOrder)
                            .catch(this.handleError);
                        break;
                }
            },
            handleOrder(order) {
                this.orderData = order;
                this.success = true;
            },
            handleConfirmOrder(data) {
                this.$router.push({
                    name: 'order',
                })
            },
            handleError({response: {data}}) {
                this.errors = data;
            },
            handleConfirmError(error) {
                if (error instanceof InvalidSmsCodeOrTokenError) {
                    this.confirmForm.errors.sms = true;
                }
            },
        },
        mounted() {
            if (['specialization', 'diagnostic'].indexOf(this.type) === -1) {
                this.$router.push({
                    name: 'order',
                });

                return;
            }

            if (this.type === 'specialization' && !this.doctor_id) {
                this.$router.push({
                    name: 'order',
                });

                return;
            }
        },
        validations() {
            return {
                form: {
                    data: {
                        name: {
                            required,
                            minLength: minLength(2),
                        },
                        phone: {
                            required,
                            minLength: minLength('38(099)999-99-99'.length),
                            maxLength: maxLength('38(099)999-99-99'.length),
                        },
                        birthday: {
                            required,
                        },
                    },
                },
                confirmForm: {
                    data: {
                        sms: {
                            required,
                            minLength: minLength(4),
                        },
                    }
                },
            };
        },
    }
</script>

<style lang="scss" scoped>
    .header {
        position: relative;

        & > span {
            position: relative;
            top: -7px;
        }
    }

    .icon__edit {
        display: inline-block;
        background-repeat: no-repeat;
        margin-left: 10px;
        position: relative;
        top: 3px;
    }


    .transition-loader {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .transition-loader-inner {
        transform: translate(-50%);
        left: 50%;
        top: 50%;
        position: absolute;
        width: 100%;
        margin-top: 30px;
        color: #b0e645;
        padding: 0 100px;
        text-align: center;

        label {
            font-size: 1em;
            padding: 1%;
            opacity: 0;
            display: inline-block;

            &:after {
                font-family: FontAwesome;
                content: '\f111';
            }
        }
    }

    $key-frames-ms: 600ms,
    500ms,
    400ms,
    300ms,
    200ms,
    100ms;

    @each $current-ms in $key-frames-ms {
        $i: index($key-frames-ms, $current-ms);
        .transition-loader-inner label:nth-child(#{$i}) {
            -webkit-animation: loader 3s $current-ms infinite ease-in-out;
            animation: loader 3s $current-ms infinite ease-in-out;
        }
    }

    @keyframes loader {
        0% {
            opacity: 0;
            transform: translateX(-300px) scale(1);
        }
        33% {
            opacity: 1;
            transform: translateX(0px) scale(2);
        }
        66% {
            opacity: 1;
            transform: translateX(0px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateX(300px) scale(2);
        }
    }

    @-webkit-keyframes loader {
        0% {
            opacity: 0;
            -webkit-transform: translateX(-300px);
        }
        33% {
            opacity: 1;
            -webkit-transform: translateX(0px);
        }
        66% {
            opacity: 1;
            -webkit-transform: translateX(0px);
        }
        100% {
            opacity: 0;
            -webkit-transform: translateX(300px);
        }
    }
</style>