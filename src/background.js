import moment from 'moment';
// var saves = {
//   enablePeriod: false,
//   start: moment("08:00","HH:mm"),
//   end: moment("18:00","HH:mm")
// }

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  console.log(request.payload)
  if(request.request=='getState'){
    getState(request.payload)
  }
  if(request.request=='enable'){
    toggleHide(request.payload)
  }
  if(request.request=='setState'){
    const key = request.payload.key
    const val = request.payload.value
    setState(key, val)
  }
})

chrome.alarms.create("checkTime",{
  periodInMinutes: 1
})

function getState(state){
  console.log("state:")
  console.log(state)
  chrome.storage.local.get(state,function(saves){
    browser.runtime.sendMessage({
      request:'returnState',
      response: saves[state] || null,
      requestState: state
    })
  })
}

chrome.alarms.onAlarm.addListener(function(alarm){
  const now = moment().utc()
  chrome.storage.local.get('periodConfig', saves=>{
    if(!saves.periodConfig) return
    const enable = saves.periodConfig.enable
    const start = saves.periodConfig.start
    const end = saves.periodConfig.end
    console.log("alarm fired")
    console.log(saves.periodConfig)
    console.log(now)
    console.log(now.isBetween(start, end))
    if(enable){
      if(now.isBetween(start, end)){
        chrome.bookmarks.search("private", nodes=>{
          if(nodes.length>0){
            hideFolder()
            setState('enable', true)
          }
        })
      }else{
        chrome.bookmarks.search("private", nodes=>{
          if(nodes.length==0){
            loadFolderFromStorage()
            setState('enable', false)
          }
        })        
      }
    }
  })

})


function setState(key, val){
  var obj = {}
  obj[key] = val
  console.log(obj)
  chrome.storage.local.set(obj)
}

function toggleHide(enabled){
  if(enabled){
    hideFolder()
  }else{
    loadFolderFromStorage()
  }
  setState('enable', enabled)
}

function saveFolderToStorage(folder){
  chrome.storage.local.set({private:folder});
}


function removeFolder(folderID){
  chrome.bookmarks.removeTree(folderID)
}

function addFolder(folder,id){
  console.log(folder);
  //iterate through all sub nodes
  //for(node in folder.children){
  for(var i=0;i<folder.children.length;i++){
      const node = Object.assign({},folder.children[i]);
      console.log("node:")
      console.log(node)
      //if bookmark
      if(node.children==null){
          chrome.bookmarks.create({
              title: node.title,
              parentId: id,
              url: node.url
          });
      }else{ // if folder
          //var temp = Object.assign({},node);
          console.log('this is a folder'+node.title);
          chrome.bookmarks.create({
              title: node.title,
              parentId: id
          }, function(result){addFolder(node,result.id)});
      }
  }
}

function removePrivate(callback){
  chrome.bookmarks.search("private",
  function(nodes){
    if(nodes.length>0){
      removeFolder(nodes[0].id)
    }
    callback()
  })
}

function hideFolder(){
  chrome.bookmarks.search("private",
  function(bookmarkTreeNodes){
      var nodes = bookmarkTreeNodes
      if(nodes.length>0){
          console.log(nodes[0].id)
          chrome.bookmarks.getSubTree(nodes[0].id,function(result){
              saveFolderToStorage(result);
          });
          removeFolder(nodes[0].id);
      }
  })
}

export {getFolder, createFolder, removePrivate} 

function getFolder(callback){
  chrome.bookmarks.search("private",
  function(bookmarkTreeNodes){
    var nodes = bookmarkTreeNodes
    if(nodes.length>0){
      chrome.bookmarks.getSubTree(nodes[0].id,function(result){
        callback(result)
    });      
    }else{
      window.alert("private folder is empty")
    }
  })
}

function createFolder(folder){
  chrome.bookmarks.create({
    title: 'private',
  }, function(result){
    addFolder(folder, result.id)
  })
}

function loadFolderFromStorage(){
  chrome.bookmarks.search("private",
  function(bookmarkTreeNodes){
    var nodes = bookmarkTreeNodes
    if(nodes.length>0){
      window.alert("already has folder private")
    }else{
      chrome.storage.local.get('private',function(saves){
        console.log(saves)
        createFolder(saves.private['0'])
    });
    }
  })
}