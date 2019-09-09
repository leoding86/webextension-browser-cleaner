import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Options',
      component: () => import('@@/components/Option')
    }, {
      path: '/test',
      name: 'Test',
      component: () => import('@@/components/Test')
    }
  ]
});
