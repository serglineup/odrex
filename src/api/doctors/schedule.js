import factory from '../factory';

export default ({doctor_id, specialization_id, clinic_id, limit = 6}) => {
    return factory()
        .get(`/doctors/${doctor_id}/schedule`, {
            params: {
                specialization_id,
                clinic_id,
                limit,
            },
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
