import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueI18n from 'vue-i18n';
import VueCompositionApi from "@vue/composition-api";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueCompositionApi);

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'zh': require('./i18n/zh.js'),
    'en': require('./i18n/en.js')
  }
});

// 非Electron模式下,需注释以下行: 把 db 挂接在 Vue原型链上
//Vue.prototype.$db = db;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
