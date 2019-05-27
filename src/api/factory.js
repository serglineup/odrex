import axios from 'axios';

export default () => {
    return axios.create({
        baseURL: 'https://odrex.space/api',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
};
