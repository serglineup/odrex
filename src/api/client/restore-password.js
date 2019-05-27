import factory from '../factory';
import {ApplicationError} from '../errors';

export class PhoneFormatError extends ApplicationError {
}

export default ({login, phone}) => {
    return factory()
        .post('/clients/forgot-password', {
            login,
            phone,
        })
        .catch(error => {
            if (error.response.status >= 500) {
                throw error;
            }

            const {response: {data: errors = {}}} = error;

            const keys = Object.keys(errors);

            if (keys.length > 0) {
                if (keys.includes('phone')) {
                    throw new PhoneFormatError();
                }

                throw new Error('invalid_request');
            }

            throw error;
        });
};
