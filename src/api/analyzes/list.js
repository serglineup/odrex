import factory from '../factory';
import moment from 'moment';
import config from '../config';

export default (api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get('/analyzes', {
            headers,
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        })
        .then(analyzes => {
            return analyzes.map(a => {
                return {
                    ...a,
                    date: moment(a.date, config.DATE_FORMAT).toISOString(true),
                };
            });
        })
        .then(analyzes => {
            return analyzes.sort((a, b) => {
                let aDate = moment(a.date).toDate();
                let bDate = moment(b.date).toDate();

                if (aDate > bDate) return -1;
                if (bDate > aDate) return 1;
                return 0;
            })
        });
};
