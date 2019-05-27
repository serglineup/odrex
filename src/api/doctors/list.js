import factory from '../factory';

export default ({specialization_id = null, clinic_id = null}) => {
    return factory()
        .get('/doctors', {
            params: {
                specialization_id,
                clinic_id,
            },
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
