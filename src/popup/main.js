import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

Vue.use(Antd);

var firebase = require("firebase/app")

require("firebase/auth")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyCrWPPmazcS0I87iJPpP09RhPdYU8YGTr4",
  authDomain: "bookmark-locker-94618.firebaseapp.com",
  databaseURL: "https://bookmark-locker-94618.firebaseio.com",
  projectId: "bookmark-locker-94618",
  storageBucket: "bookmark-locker-94618.appspot.com",
  messagingSenderId: "927027887257",
  appId: "1:927027887257:web:462008083c163791efcc08",
  measurementId: "G-30ENEVWK8H"
};

firebase.initializeApp(firebaseConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
