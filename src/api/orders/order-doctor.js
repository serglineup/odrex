import factory from '../factory';
import moment from 'moment';

export default ({doctor_id, specialization_id, datetime}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    let format_datetime = moment(datetime).format('DD.MM.YYYY HH:mm');

    return factory()
        .post(`/doctors/${doctor_id}/order`, {
            datetime: format_datetime,
        }, {
            headers,
            params: {
                specialization_id,
            },
        })
        .then(({data: responseData = null}) => {
            return responseData;
        })
        .then(order => {
            return order;
        });
};
