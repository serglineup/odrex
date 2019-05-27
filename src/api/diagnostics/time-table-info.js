import factory from '../factory';

export default ({diagnostic_id, time_table_id}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get(`/diagnostics/${diagnostic_id}/time-table/${time_table_id}/pre-order`, {
            headers,
        })
        .then(({data: {data: responseData = null}}) => {
            return responseData;
        });
};
