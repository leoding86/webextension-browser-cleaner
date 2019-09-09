import browser from '@/modules/Browser';
import Vue from 'vue';
import App from './App';
import router from './router';
import './elementUI';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import './index.scss';

const app = window.app = {};

browser.storage.local.get(null, items => {
  app.storageItems = items;

  /* eslint-disable no-new */
  new Vue({
    el: '#app',

    router,

    render: h => h(App)
  });
});
