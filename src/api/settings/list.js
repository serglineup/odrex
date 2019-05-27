import factory from '../factory';

export default () => {
    return factory()
        .get('/settings', {})
        .then(({data: responseData = []}) => {
            return responseData;
        });
};
