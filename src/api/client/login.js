import factory from '../factory';
import {ApplicationError} from '../errors';

export class InvalidCredentialsError extends ApplicationError {
}

export class InvalidSmsCodeError extends ApplicationError {
}

export class NeedSmsCodeError extends ApplicationError {
}

export default ({login, password, sms_code = null}) => {
    return factory()
        .post('/clients/login', {
            login,
            password,
            sms_code,
        })
        .then(({data: {data: responseData = null}}) => {
            if (responseData) {
                return responseData;
            }

            throw new NeedSmsCodeError();
        }, error => {
            if (error.response.status >= 500) {
                throw error;
            }

            const {response: {data: {errors}}} = error;

            if (errors.includes(2)) {
                throw new InvalidCredentialsError();
            }

            if (errors.includes(33)) {
                throw new InvalidSmsCodeError();
            }

            if (errors.includes(34)) {
                throw new NeedSmsCodeError();
            }

            throw error;
        });
};
