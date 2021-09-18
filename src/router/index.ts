import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { store, getters } from '@store';
import Home from '@pages/Home.vue';
import SelectTalent from '@pages/SelectTalent.vue';
import SelectPoints from '@pages/SelectPoint.vue';
import RemakeGame from '@pages/RemakeGame.vue';
import CheckResult from '@pages/CheckResult.vue';

const routers: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/select-talent',
        component: SelectTalent,
        beforeEnter: (form, to, next) => {
            if(store.state.loadSource.loadSouceStatus !== 'RESOLVED') {
                next({
                    path: '/',
                });
            } else {
                next();
            }
        }
    },
    {
        path: '/select-point',
        component: SelectPoints,
        beforeEnter: (from, to, next) => {
            if (!store.state.talent.selectedTalents.length) {
                next({
                    path: '/select-talent',
                })
            } else {
                next();
            }
        }
    },
    {
        path: '/remake-game',
        component: RemakeGame,
        beforeEnter: (from, to, next) => {
            if (getters('property/canUsePointNum') !== 0) {
                next({
                    path: '/select-point'
                })
            } else {
                next()
            }
        }
    },
    {
        path: '/check-result',
        component: CheckResult,
        beforeEnter: (from, to, next) => {
            if (!getters('gameResult/hasResult')) {
                next({
                    path: '/remake-game'
                })
            } else {
                next()
            }
        }
    }
];

const router = createRouter({
    routes: routers,
    history: createWebHistory('/remake'),
});

export default router;