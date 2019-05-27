import factory from '../factory';

export default (id, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get(`/visits/${id}/payment-link`, {
            headers,
        });
};
