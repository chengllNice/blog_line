// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import 'jquery.nicescroll'
import vuescroll from 'vuescroll'
import './assets/resources/boostrap/css/bootstrap.min.css'
import './assets/resources/boostrap/js/bootstrap.min'
import store from './vuex/store'

import Toast from './common_components/toast/toast'

Vue.use(Toast);
Vue.use(vuescroll)

Vue.filter('dateFormat', (value) =>{
  let date = new Date(value);
  let year = date.getFullYear();
  let mouth = date.getMonth()+1;
  let day = date.getDay();
  if(mouth<10){
    mouth = '0' + mouth;
  }
  if(day<10){
    day = '0' + day;
  }
  let nowDate = `${year}-${mouth}-${day}`
  return nowDate;
});
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
