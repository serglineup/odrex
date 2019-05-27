import factory from '../factory';

export default ({diagnostic_id, clinic_id, limit = 6}) => {
    return factory()
        .get(`/diagnostics/${diagnostic_id}/schedule`, {
            params: {
                clinic_id,
                limit,
            },
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
