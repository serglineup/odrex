import factory from '../factory';

export default () => {
    return factory()
        .get('/sliders')
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
