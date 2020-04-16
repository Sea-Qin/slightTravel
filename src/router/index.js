import Vue from 'vue';
import Router from 'vue-router';
import writePage from './configParts/writePage';
import articalShow from './configParts/ArticalShow';
import mapTrack from './configParts/mapTrack';

// router lazy load
Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'basic',
      redirect: '/mapTrack',
      component: () => import('@/components/BasicLayout'),
      children: [
        writePage,
        articalShow,
        mapTrack
      ]
    },
    {
      path: '*',
      component: () => import('@/views/ErrorPage')
    }
  ]
});
