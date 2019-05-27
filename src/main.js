import Vue from 'vue';

Vue.config.productionTip = false;
Vue.config.devtools = true;

import Vuelidate from 'vuelidate';
import BootstrapVue from 'bootstrap-vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import vSelect from 'vue-select';

import router from './router';
import store from './store';

import App from './App.vue';

import './assets/scss/index.scss';

import moment from 'moment';
moment.locale('ru');

Vue.use(Vuelidate);
Vue.use(BootstrapVue);

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCSBPW4XM_TVAxk0ThPIAsw7g4Xjnukp8M',
    },
});

Vue.component('v-select', vSelect);

window.OdrexApp = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
