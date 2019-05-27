import factory from '../factory';
import moment from 'moment';
import config from '../config';

export default ({doctor_id, specialization_id, clinic_id = null}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    let start = moment();
    let end = start.clone().add({ months: 3 });

    return factory()
        .get(`/doctors/${doctor_id}/time-table`, {
            headers,
            params: {
                specialization_id,
                clinic_id,
                start: start.format(config.DATE_FORMAT),
                end: end.format(config.DATE_FORMAT),
            },
        })
        .then(({data: {data: responseData = []}}) => {
            return responseData;
        })
        .then(timeTables => {
            return timeTables.map(v => {
                return {
                    ...v,
                    start: moment(v.start, config.DATE_TIME_FORMAT).toISOString(true),
                    end: moment(v.end, config.DATE_TIME_FORMAT).toISOString(true),
                };
            });
        })
        .then(timeTables => {
            return timeTables.filter((timeTable) => {
                if (timeTable.is_visited) return false;

                let date = moment(timeTable.start).toDate();
                if (date <= new Date()) return false;

                return true;
            })
        })
        .then(timeTables => {
            return timeTables.sort((a, b) => {
                let aDate = moment(a.start).toDate();
                let bDate = moment(b.start).toDate();

                if (aDate > bDate) return 1;
                if (bDate > aDate) return -1;
                return 0;
            })
        })
        .then(timeTables => {
            let timeTableGroups = {};

            for (const timeTable of timeTables) {
                let start = moment(timeTable.start);

                let date = start.format(config.DATE_FORMAT);
                let time = start.format(config.TIME_FORMAT);

                if (!timeTableGroups[date]) {
                    timeTableGroups[date] = {};
                }

                if (!timeTableGroups[date][time]) {
                    timeTableGroups[date][time] = timeTable;
                }
            }

            return timeTableGroups;
        });
};
