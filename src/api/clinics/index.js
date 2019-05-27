import factory from '../factory';

export default () => {
    return factory()
        .get('/clinics')
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
