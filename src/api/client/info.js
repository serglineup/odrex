import factory from '../factory';
import moment from 'moment';
import config from '../config';
import {ApplicationError} from '../errors';

export class EmailNotConfirmError extends ApplicationError {
}

export class PhoneNotConfirmError extends ApplicationError {
}

export default (api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .get('/clients/info', {
            headers,
        })
        .then(({data: {data: result = null}}) => {
            return result;
        })
        .then(user => {
            return {
                ...user,
                birthday: moment(user.birthday, config.DATE_FORMAT).toISOString(true),
            };
        });
};
