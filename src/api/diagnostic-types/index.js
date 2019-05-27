import factory from '../factory';

export default () => {
    return factory()
        .get('/diagnostic-types')
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
