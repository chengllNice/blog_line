// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/stores'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import {socketUrl} from "../../vue/src/config/config";

Vue.use(VueSocketio, socketio(socketUrl));

Vue.use(iView);
Vue.prototype.dateFormat = (value) => {
  let date = new Date(value);
  let year = date.getFullYear();
  let mouth = date.getMonth()+1;
  let day = date.getDate();
  let H = date.getHours();
  let M = date.getMinutes();
  let S = date.getSeconds();
  if(mouth<10){
    mouth = '0' + mouth;
  }
  if(day<10){
    day = '0' + day;
  }
  if(H<10){
    H = '0' + H;
  }
  if(M<10){
    M = '0' + M;
  }
  if(S<10){
    S = '0' + S;
  }
  let nowDate = `${year}-${mouth}-${day}  ${H}:${M}:${S}`
  return nowDate;
};

Vue.prototype.goBack = () => {
  router.go(-1);
};

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
