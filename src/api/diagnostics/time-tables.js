import factory from '../factory';
import moment from 'moment';
import config from '../config';

export default ({diagnostic_id, clinic_id = null}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    let start = moment();
    let end = start.clone().add({ months: 3 });

    return factory()
        .get(`/diagnostics/${diagnostic_id}/time-table`, {
            headers,
            params: {
                clinic_id,
                start: start.format(config.DATE_FORMAT),
                end: end.format(config.DATE_FORMAT),
            },
        })
        .then(({data: {data: timeTables = [], meta: {doctors = []}}}) => {
            return {
                timeTables,
                doctors,
            };
        })
        .then(({timeTables, doctors}) => {
            let localTimeTables = timeTables.map(v => {
                return {
                    ...v,
                    start: moment(v.start, config.DATE_TIME_FORMAT).toISOString(true),
                    end: moment(v.end, config.DATE_TIME_FORMAT).toISOString(true),
                };
            });

            return {
                timeTables: localTimeTables,
                doctors,
            }
        })
        .then(({timeTables, doctors}) => {
            let localTimeTables = timeTables.filter((timeTable) => {
                if (timeTable.is_visited) return false;

                let date = moment(timeTable.start).toDate();
                if (date <= new Date()) return false;

                return true;
            });

            return {
                timeTables: localTimeTables,
                doctors,
            }
        })
        .then(({timeTables, doctors}) => {
            let localTimeTables = timeTables.sort((a, b) => {
                let aDate = moment(a.start).toDate();
                let bDate = moment(b.start).toDate();

                if (aDate > bDate) return 1;
                if (bDate > aDate) return -1;
                return 0;
            });

            return {
                timeTables: localTimeTables,
                doctors,
            }
        })
        .then(({timeTables, doctors}) => {
            let doctorGroups = {
                "": {},
            };

            for (const timeTable of timeTables) {
                let start = moment(timeTable.start);

                let date = start.format(config.DATE_FORMAT);
                let time = start.format(config.TIME_FORMAT);

                if (!doctorGroups[timeTable.doctor_id]) {
                    doctorGroups[timeTable.doctor_id] = {};
                }

                if (!doctorGroups[timeTable.doctor_id][date]) {
                    doctorGroups[timeTable.doctor_id][date] = {};
                }

                if (!doctorGroups[""][date]) {
                    doctorGroups[""][date] = {};
                }

                if (!doctorGroups[timeTable.doctor_id][date][time]) {
                    doctorGroups[timeTable.doctor_id][date][time] = timeTable;
                }

                if (!doctorGroups[""][date][time]) {
                    doctorGroups[""][date][time] = timeTable;
                }
            }

            doctors = [
                {
                    id: '',
                    name: 'Все врачи',
                },
                ...doctors,
            ];

            return {
                doctorGroups,
                doctors,
            }
        });
};
