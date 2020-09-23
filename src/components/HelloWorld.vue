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
        Blah
      </a-row>
      <a-row>
        Blah
      </a-row>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted () {
    browser.runtime.sendMessage({
      request: "getState"
    })
    browser.runtime.onMessage.addListener((request, sender, sendResponse)=>{
      console.log(request)
      if(request.request == 'getState'){
        this.enable = request.response
        console.log(this.enable)
        console.log(this.b)
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
      b: 3
    }
  },
  methods: {
    OnChange(checked){
      this.enable = checked
      browser.runtime.sendMessage({
        request: "setState",
        payload: checked
      })
    }
  },
  // watch: {
  //   enabdle(newval){
  //     chrome.storage.set({enableHidding:checked})
  //     browser.runtime.sendMessage("fuckyou")
  //     this.enable = checked
  //   }
  // }
}
</script>

<style scoped>
div {
  width: 200px;
  height: 100px;
}
</style>
