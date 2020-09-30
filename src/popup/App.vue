<template>
  <hello-world v-if="signedIn" />
  <div v-else id='firebaseui-auth-container'/>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
var firebase = require("firebase/app")
var firebaseui = require('firebaseui')

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
var ui = new firebaseui.auth.AuthUI(firebase.auth())

export default {
  name: 'App',
  components: { HelloWorld },
  data() {
    return {
      signedIn: false, 
      uid: ""
    }
  },
  mounted(){
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl)=>{
          console.log(authResult)
          this.signedIn = true
          this.uid = firebase.auth().currentUser.uid
          console.log(firebase.auth().currentUser.uid)
          var res = firebase.database().ref('users/test').set({
            test:'test'
          }).then(success=>{
            console.log(success)
          },error=>{
            console.log(error)
          })
          console.log(res)
          return false
        }
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    })
  }
}
</script>

<style>
html {
  width: 200px;
  height: 200px;
}
</style>
