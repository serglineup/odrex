import factory from '../factory';

export default ({doctor_id, time_table_id, specialization_id}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get(`/doctors/${doctor_id}/time-table/${time_table_id}/pre-order`, {
            headers,
            params: {
                specialization_id,
            },
        })
        .then(({data: {data: responseData = null}}) => {
            return responseData;
        });
};
