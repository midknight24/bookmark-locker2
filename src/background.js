browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.request=='getState'){
    getState()
  }
  if(request.request=='setState'){
    changeState(request.payload)
  }
})


function getState(){
  chrome.storage.local.get('enableHidden', saves=>{
    var enabled = saves.enableHidden || false
    browser.runtime.sendMessage({
      request: 'getState',
      response: enabled
    })
  })
}

function changeState(enabled){
  if(enabled){
    hideFolder()
  }else{
    loadFolder()
  }
  chrome.storage.local.set({enableHidden:enabled})
}

function saveFolder(folder){
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

function hideFolder(){
  chrome.bookmarks.search("private",
  function(bookmarkTreeNodes){
      var nodes = bookmarkTreeNodes
      if(nodes.length>0){
          console.log(nodes[0].id)
          chrome.bookmarks.getSubTree(nodes[0].id,function(result){
              saveFolder(result);
          });
          removeFolder(nodes[0].id);
          hidden = true
      }
  })
}

function loadFolder(){
  chrome.bookmarks.search("private",
  function(bookmarkTreeNodes){
    var nodes = bookmarkTreeNodes
    if(nodes.length>0){
      window.alert("already has folder private")
    }else{
      chrome.storage.local.get('private',function(saves){
        chrome.bookmarks.create({
            title: 'private',
        },function(result){
            addFolder(saves.private['0'],result.id)
        });
    });
    }
  })
}