<template>
  <div id='firebaseui-auth-container'/>
</template>

<script>
import {getFolder, createFolder, removePrivate} from '@/background.js'
var firebase = require("firebase/app")
var firebaseui = require('firebaseui')

require("firebase/auth")
require("firebase/database")
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
  name: 'Backend',
  props: ["action"],
  data() {
    return {
      signedIn: true, 
      uid: ""
    }
  },
  mounted(){
    ui.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl)=>{
          this.signedIn = true
          this.uid = firebase.auth().currentUser.uid
          if(this.action=='upload'){
            getFolder(folder=>{
              var ref = firebase.database().ref('users/'+this.uid)
              ref.set({
                private: folder
              })
              this.$message.success("uploaded to cloud",2)
              this.$emit("signInSuccess")
            })
          }
          else if(this.action=='download'){
            firebase.database().ref('users/'+this.uid+'/private').once('value')
            .then(res=>{
              removePrivate(()=>{
                createFolder(res.val()[0])
              })
              this.$message.success("downloaded to local",2)
              this.$emit("signInSuccess")
            })
            .catch(err=>{
              this.$message.error(err)
            })
          }

          console.log("done")
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
