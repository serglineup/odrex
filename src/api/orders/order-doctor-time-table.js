import factory from '../factory';
import moment from 'moment';
import config from '../config';
import {InvalidSmsCodeOrTokenError} from './errors';

export let confirmGuestDoctorTimeTable = ({doctor_id, time_table_id, id, token, sms}) => {
    let headers = {};

    return factory()
        .post(`/doctors/${doctor_id}/time-table/${time_table_id}/order`, {
            id,
            token,
            sms,
        }, {
            headers,
        })
        .then(({data: responseData = null}) => {
            return responseData;
        }, error => {
            if (error.response.status >= 500) {
                throw error;
            }

            const {response: {data: errors = {}}} = error;

            const keys = Object.keys(errors);

            if (keys.length > 0) {
                if (keys.includes('errors')) {
                    const localErrors = errors['errors'];

                    if (localErrors.includes(778)) {
                        throw new InvalidSmsCodeOrTokenError();
                    }
                }

                throw new Error('invalid_request');
            }

            throw error;
        });
};

export let orderGuestDoctorTimeTable = ({doctor_id, time_table_id, specialization_id, pay = 1, name, phone, birthday}) => {
    let headers = {};

    let imei = '000000000000000';

    return factory()
        .post(`/doctors/${doctor_id}/time-table/${time_table_id}/order`, {
            imei,
            name,
            phone,
            birthday,
        }, {
            headers,
            params: {
                specialization_id,
                pay,
            },
        })
        .then(({data: responseData = null}) => {
            return responseData;
        })
        .then(order => {
            if (order.meta && order.meta.expired_date) {
                return {
                    ...order,
                    meta: {
                        ...order.meta,
                        expired_date: moment(order.meta.expired_date, config.STANDARD_DATE_TIME_FORMAT).toISOString(true),
                    },
                };
            }

            return order;
        });
};

export default ({doctor_id, time_table_id, specialization_id, pay = 1}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    let imei = '000000000000000';

    return factory()
        .post(`/doctors/${doctor_id}/time-table/${time_table_id}/order`, {
            imei,
        }, {
            headers,
            params: {
                specialization_id,
                pay,
            },
        })
        .then(({data: responseData = null}) => {
            return responseData;
        })
        .then(order => {
            if (order.meta && order.meta.expired_date) {
                return {
                    ...order,
                    meta: {
                        ...order.meta,
                        expired_date: moment(order.meta.expired_date, config.STANDARD_DATE_TIME_FORMAT).toISOString(true),
                    },
                };
            }

            return order;
        });
};
