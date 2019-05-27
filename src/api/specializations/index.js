import factory from '../factory';

export default () => {
    return factory()
        .get('/specializations')
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        });
};
