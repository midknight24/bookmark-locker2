<template>
  <div>
    <a-layout>
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
    </a-layout>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'HelloWorld',
  mounted () {
    browser.runtime.sendMessage({
      request: "getState",
      payload: "enable"
    }),
    // browser.runtime.sendMessage({
    //   request: "getState",
    //   payload: "start"
    // }),
    // browser.runtime.sendMessage({
    //   request: "getState",
    //   payload: "end"
    // }),
    browser.runtime.sendMessage({
      request: "getState",
      payload: "periodConfig"
    })
    browser.runtime.onMessage.addListener((request, sender, sendResponse)=>{
      console.log(request)
      if(request.request == 'getState'){
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
    }
  }
}
</script>

<style scoped>
div {
  width: 200px;
  height: 100px;
}
</style>
