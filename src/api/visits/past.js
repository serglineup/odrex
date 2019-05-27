import factory from '../factory';
import moment from 'moment';
import config from '../config';

export default (api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get('/visits/past', {
            headers,
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        })
        .then(visits => {
            return visits.map(v => {
                let content_size = v.content_size ? Number(v.content_size / 1024).toFixed(2) : null;

                return {
                    ...v,
                    date: moment(v.date, config.DATE_FORMAT).toISOString(true),
                    content_size,
                };
            });
        })
        .then(visits => {
            return visits.sort((a, b) => {
                let aDate = moment(a.date).toDate();
                let bDate = moment(b.date).toDate();

                if (aDate > bDate) return -1;
                if (bDate > aDate) return 1;
                return 0;
            })
        });
};
