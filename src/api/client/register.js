import factory from '../factory';
import {ApplicationError} from '../errors';

export class DuplicatePhoneNumberError extends ApplicationError {
}

export class DuplicateEmailError extends ApplicationError {
}

export class SendingRegistrationEmailError extends ApplicationError {
}

export class PhoneFormatError extends ApplicationError {
}

export default ({name, birthday, phone, password, email, address}) => {
    return factory()
        .post('/clients/register', {
            name,
            birthday,
            phone,
            password,
            email,
            address,
        })
        .then(({data: {data: responseData = null}}) => {
            return responseData;
        }, error => {
            if (error.response.status >= 500) {
                throw error;
            }

            const {response: {data: errors = {}}} = error;

            const keys = Object.keys(errors);

            if (keys.length > 0) {
                if (keys.includes('phone')) {
                    throw new PhoneFormatError();
                }

                if (keys.includes('errors')) {
                    const localErrors = errors['errors'];

                    if (localErrors.includes(5958)) {
                        throw new DuplicatePhoneNumberError();
                    }

                    if (localErrors.includes(5959)) {
                        throw new DuplicateEmailError();
                    }

                    if (localErrors.includes(5967)) {
                        throw new SendingRegistrationEmailError();
                    }
                }

                throw new Error('invalid_request');
            }

            throw error;
        });
};
