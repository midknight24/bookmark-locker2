<template>
  <div>
    <a-layout v-if="!showSignIn" class="main">
      <a-row>
        <h2>Hide</h2>
        <div>
          <a-switch :checked="enable" @change="OnChange" :style="{float: 'right'}"/>
        </div>
      </a-row>
      <a-row>
        <h2>Hide Between</h2>
          <span>
            <a-time-picker :value="periodConfig.start" @change="UpdateStart" format="HH:mm"></a-time-picker>
            <a-time-picker :value="periodConfig.end" @change="UpdateEnd" format="HH:mm"></a-time-picker>
          </span>
          <span>
            <a-switch :checked="periodConfig.enable" @change="togglePeriod" :style="{float: 'right'}"/>
          </span>
      </a-row>
      <a-row :style="{'margin-top':'8px','margin-bottom':'8px'}">
        <a-button type="primary" :style="{'margin-right': '5px'}" @click="uploadFolder">Upload</a-button>
        <a-button type="primary" @click="downloadFolder">Download</a-button>
      </a-row>
    </a-layout>
    <Backend v-else @signInSuccess="showSignIn=false;action=''" :action="action"></Backend>
  </div>
</template>

<script>
import moment from 'moment';
import Backend from '@/components/Backend.vue'
export default {
  name: 'HelloWorld',
  components: {Backend},
  mounted () {
    browser.runtime.sendMessage({
      request: "getState",
      payload: "enable"
    }),
    // browser.runtime.sendMessage({
    //   request: "getState",
    //   payload: "periodConfig"
    // })
    browser.runtime.onMessage.addListener((request, sender, sendResponse)=>{
      console.log(request)
      if(request.request == 'returnState'){
        console.log(request.requestState)
        if(request.response){
          this[request.requestState] = request.response
        }
        console.log(request.response)
      }
    })
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  },
  data: function() {
    return {
      enable: false,
      showSignIn: false,
      action: "",
      periodConfig: {
        start: moment("08:00","HH:mm"),
        end: moment("18:00","HH:mm"),
        enable: false
      }
    }
  },
  methods: {
    OnChange(checked){
      console.log("trigger")
      this.enable = checked
      browser.runtime.sendMessage({
        request: "enable",
        payload: checked
      })
    },
    UpdateStart(start){
      this.periodConfig.start = start
      browser.runtime.sendMessage({
        request: "setState",
        payload: {
          "key": "periodConfig",
          "value": this.periodConfig
        }
      })
    },
    UpdateEnd(end){
      this.periodConfig.end = end
      browser.runtime.sendMessage({
        request: "setState",
        payload: {
          "key": "periodConfig",
          "value": this.periodConfig
        }
      })
    },
    togglePeriod(enable){
      this.periodConfig.enable = enable
      browser.runtime.sendMessage({
        request: "setState",
        payload: {
          "key": "periodConfig",
          "value": this.periodConfig
        }
      })
    },
    uploadFolder(e){
      this.action = "upload"
      this.showSignIn = true
    },
    downloadFolder(e){
      this.action = "download"
      this.showSignIn = true
    }
  }
}
</script>

<style scoped>
.main {
  width: 200px;
  height: 100px;
}
</style>
