import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'
import Registration from './views/Registration.vue'
import RestorePassword from './views/RestorePassword.vue'
import Profile from './views/Profile.vue'
import Info from './views/profile/Info.vue'
import InfoChange from './views/profile/InfoChange.vue'
import PasswordChange from './views/profile/PasswordChange.vue'
import Dashboard from './views/profile/Dashboard.vue'
import MobileInstall from './views/profile/MobileInstall'
import Order from './views/profile/Order.vue'
import OrderGuest from './views/profile/OrderGuest.vue'
import OrderFindDoctor from './views/profile/OrderFindDoctor.vue'
import OrderFindDiagnostic from './views/profile/OrderFindDiagnostic.vue'
import OrderChooseDoctor from './views/profile/OrderChooseDoctor.vue'
import OrderChooseDiagnostic from './views/profile/OrderChooseDiagnostic.vue'
import OrderChooseDoctorTimeTable from './views/profile/OrderChooseDoctorTimeTable.vue'
import OrderChooseDiagnosticTimeTable from './views/profile/OrderChooseDiagnosticTimeTable.vue'
import OrderFindLimit from './views/profile/OrderFindLimit.vue'
import VisitsPast from './views/profile/VisitsPast.vue'
import VisitsCurrent from './views/profile/VisitsCurrent.vue'
import ConsultationsPast from './views/profile/ConsultationsPast.vue'
import ConsultationsCurrent from './views/profile/ConsultationsCurrent.vue'
import DiagnosticsPast from './views/profile/DiagnosticsPast.vue'
import DiagnosticsCurrent from './views/profile/DiagnosticsCurrent.vue'
import VisitDocument from './views/profile/VisitDocument.vue'
import Analyzes from './views/profile/Analyzes.vue'
import Clinics from './views/profile/Clinics.vue'
import Rules from './views/Rules.vue'

import {isGuest, isLoggedIn, ifAuthRedirect} from "./guards/auth";

import store from './store';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: {
                name: 'login',
            },
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            props: true,
            beforeEnter: isGuest,
        },
        {
            path: '/registration',
            name: 'registration',
            component: Registration,
        },
        {
            path: '/restore-password',
            name: 'restore-password',
            component: RestorePassword,
            beforeEnter: isGuest,
        },
        {
            path: '/help',
            name: 'help',
            redirect: {
                name: 'home',
            },
        },
        {
            path: '/profile',
            component: Profile,
            beforeEnter: isLoggedIn,
            children: [
                {
                    path: '',
                    name: 'profile',
                    component: Dashboard,
                },
                {
                    path: 'mobile-install',
                    name: 'mobile-install',
                    component: MobileInstall,
                },
                {
                    path: 'clinics',
                    name: 'profile.clinics',
                    component: Clinics,
                },
                {
                    path: 'info',
                    name: 'profile.info',
                    component: Info,
                    redirect: {
                        name: 'profile.info.info-change',
                    },
                    children: [
                        {
                            path: 'info-change',
                            name: 'profile.info.info-change',
                            component: InfoChange,
                        },
                        {
                            path: 'password-change',
                            name: 'profile.info.password-change',
                            component: PasswordChange,
                        },
                    ],
                },
                {
                    path: 'order',
                    name: 'profile.order',
                    component: Order,
                    redirect: {
                        name: 'profile.order.find-doctor',
                    },
                    children: [
                        {
                            path: 'find-doctor',
                            name: 'profile.order.find-doctor',
                            component: OrderFindDoctor,
                            beforeEnter(to, from, next) {
                                if (store.state.auth.user.available_record_today > 0) {
                                    next();
                                } else {
                                    next({
                                        name: 'profile.order.find-limit',
                                    });
                                }
                            },
                            props: ({query: {specialization_id = null, clinic_id = null}}) => ({
                                specialization_id,
                                clinic_id,
                            }),
                        },
                        {
                            path: 'choose-doctor',
                            name: 'profile.order.choose-doctor',
                            component: OrderChooseDoctor,
                            props: ({query: {specialization_id, clinic_id = null}}) => ({
                                specialization_id,
                                clinic_id,
                            }),
                        },
                        {
                            path: 'choose-doctor-time-table',
                            name: 'profile.order.choose-doctor-time-table',
                            component: OrderChooseDoctorTimeTable,
                            props: ({query: {specialization_id, doctor_id, clinic_id = null}}) => ({
                                specialization_id,
                                doctor_id,
                                clinic_id,
                            }),
                        },
                        {
                            path: 'find-diagnostic',
                            name: 'profile.order.find-diagnostic',
                            component: OrderFindDiagnostic,
                            beforeEnter(to, from, next) {
                                if (store.state.auth.user.available_record_today > 0) {
                                    next();
                                } else {
                                    next({
                                        name: 'profile.order.find-limit',
                                    });
                                }
                            },
                            props: ({query: {diagnostic_type_id = null, clinic_id = null}}) => ({
                                diagnostic_type_id,
                                clinic_id,
                            }),
                        },
                        {
                            path: 'choose-diagnostic',
                            name: 'profile.order.choose-diagnostic',
                            component: OrderChooseDiagnostic,
                            props: ({query: {diagnostic_type_id, clinic_id}}) => ({
                                diagnostic_type_id,
                                clinic_id,
                            }),
                        },
                        {
                            path: 'choose-diagnostic-time-table',
                            name: 'profile.order.choose-diagnostic-time-table',
                            component: OrderChooseDiagnosticTimeTable,
                            props: ({query: {diagnostic_id, diagnostic_type_id, clinic_id}}) => ({
                                diagnostic_id,
                                diagnostic_type_id,
                                clinic_id,
                            }),
                        },
                        {
                            path: 'find-limit',
                            name: 'profile.order.find-limit',
                            component: OrderFindLimit,
                        },
                    ],
                },
                {
                    path: 'visits-past',
                    name: 'profile.visits.past',
                    component: VisitsPast,
                    redirect: {
                        name: 'profile.visits.past.consultations',
                    },
                    children: [
                        {
                            path: 'consultations',
                            name: 'profile.visits.past.consultations',
                            component: ConsultationsPast,
                        },
                        {
                            path: 'diagnostics',
                            name: 'profile.visits.past.diagnostics',
                            component: DiagnosticsPast,
                        },
                    ],
                },
                {
                    path: 'visits-current',
                    name: 'profile.visits.current',
                    component: VisitsCurrent,
                    redirect: {
                        name: 'profile.visits.current.consultations',
                    },
                    children: [
                        {
                            path: 'consultations',
                            name: 'profile.visits.current.consultations',
                            component: ConsultationsCurrent,
                        },
                        {
                            path: 'diagnostics',
                            name: 'profile.visits.current.diagnostics',
                            component: DiagnosticsCurrent,
                        },
                    ],
                },
                {
                    path: 'analyzes',
                    name: 'profile.analyzes',
                    component: Analyzes,
                },
            ],
        },
        {
            path: '/order',
            name: 'order',
            component: Order,
            redirect: {
                name: 'order.find-doctor',
            },
            children: [
                {
                    path: 'guest',
                    name: 'order.guest',
                    component: OrderGuest,
                    beforeEnter: ifAuthRedirect('profile.order'),
                    props: ({query: {type = null, service_id = null, time_table_id = null, doctor_id = null}}) => ({
                        type,
                        service_id,
                        time_table_id,
                        doctor_id,
                    }),
                },
                {
                    path: 'find-doctor',
                    name: 'order.find-doctor',
                    component: OrderFindDoctor,
                    beforeEnter: ifAuthRedirect('profile.order.find-doctor'),
                    props: ({query: {specialization_id = null, clinic_id = null}}) => ({
                        specialization_id,
                        clinic_id,
                        guest: true,
                    }),
                },
                {
                    path: 'choose-doctor',
                    name: 'order.choose-doctor',
                    component: OrderChooseDoctor,
                    beforeEnter: ifAuthRedirect('profile.order.choose-doctor'),
                    props: ({query: {specialization_id, clinic_id = null}}) => ({
                        specialization_id,
                        clinic_id,
                        guest: true,
                    }),
                },
                {
                    path: 'choose-doctor-time-table',
                    name: 'order.choose-doctor-time-table',
                    component: OrderChooseDoctorTimeTable,
                    beforeEnter: ifAuthRedirect('profile.order.choose-doctor-time-table'),
                    props: ({query: {specialization_id, doctor_id, clinic_id = null}}) => ({
                        specialization_id,
                        doctor_id,
                        clinic_id,
                        guest: true,
                    }),
                },
                {
                    path: 'find-diagnostic',
                    name: 'order.find-diagnostic',
                    component: OrderFindDiagnostic,
                    beforeEnter: ifAuthRedirect('profile.order.find-diagnostic'),
                    props: ({query: {diagnostic_type_id = null, clinic_id = null}}) => ({
                        diagnostic_type_id,
                        clinic_id,
                        guest: true,
                    }),
                },
                {
                    path: 'choose-diagnostic',
                    name: 'order.choose-diagnostic',
                    component: OrderChooseDiagnostic,
                    beforeEnter: ifAuthRedirect('profile.order.choose-diagnostic'),
                    props: ({query: {diagnostic_type_id, clinic_id = null}}) => ({
                        diagnostic_type_id,
                        clinic_id,
                        guest: true,
                    }),
                },
                {
                    path: 'choose-diagnostic-time-table',
                    name: 'order.choose-diagnostic-time-table',
                    component: OrderChooseDiagnosticTimeTable,
                    beforeEnter: ifAuthRedirect('profile.order.choose-diagnostic-time-table'),
                    props: ({query: {diagnostic_id, diagnostic_type_id, clinic_id = null}}) => ({
                        diagnostic_id,
                        diagnostic_type_id,
                        clinic_id,
                        guest: true,
                    }),
                },
            ],
        },
        {
            path: '/rules',
            name: 'rules',
            component: Rules,
        },
    ],
});

export default router;
