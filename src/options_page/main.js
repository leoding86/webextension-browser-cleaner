import browser from '@/modules/Browser';
import Vue from 'vue';
import App from './App';
import router from './router';
import './elementUI';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import './index.scss';

browser.storage.local.get(null, items => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',

    router,

    data() {
      return {
        storageItems: items
      }
    },

    beforeMount() {
      let vm = this;

      browser.storage.onChanged.addListener(items => {
        Object.keys(items).forEach(key => {
          vm.storageItems[key] = items[key].newValue;
        });
      });
    },

    render: h => h(App)
  });
});
