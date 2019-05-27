import factory from '../factory';

export default ({id}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .post(`/visits/current/${id}/cancel`, {}, {
            headers,
        })
        .then(({data = null}) => {
            return data;
        });
};
