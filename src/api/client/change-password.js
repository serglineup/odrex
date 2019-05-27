import factory from '../factory';
import {ApplicationError} from '../errors';

export class InvalidPasswordError extends ApplicationError {
}

export default ({old_password, new_password}, api_token) => {
    let headers = {};

    if (api_token) {
        headers['Authorization'] = `Bearer ${api_token}`;
    }

    return factory()
        .post('/clients/change-password', {
            old_password,
            new_password,
        }, {
            headers,
        })
        .then(null, error => {
            const {response: {data: {errors = []}}} = error;

            if (errors.includes(5)) {
                throw new InvalidPasswordError();
            }

            throw error;
        });
};
