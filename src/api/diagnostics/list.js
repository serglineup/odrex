import factory from '../factory';

export default ({diagnostic_type_id = null, clinic_id = null}) => {
    return factory()
        .get('/diagnostics', {
            params: {
                diagnostic_type_id,
                clinic_id,
            },
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
