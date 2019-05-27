import factory from '../factory';

export default ({id}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get(`/analyzes/${id}`, {
            headers,
            responseType: 'blob',
        })
        .then(({data = null}) => {
            return data;
        });
};
