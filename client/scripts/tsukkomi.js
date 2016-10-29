// Tsukkomi

'use strict';

const insertStyle = function() {
  const cssId = 'tsukkomi-style';
  if (!document.getElementById(cssId)) {
    
    const tsukkomiImageStyle = ' \
      .tsukkomi-enabled img {    \
        width: 100%;              \
      } \
      .tsukkomi-enabled { \
        position: relative; \
      ';

    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = tsukkomiImageStyle;
    } else {
      style.appendChild(document.createTextNode(tsukkomiImageStyle));
    }

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }
}

// Usage:
// <div id="[image_id]" onclick="addTsukkomi(event, this.id)"></div>
const addTsukkomi = function(event, id) {

  var associatedElement = document.getElementById(id);

  // // Clear the previous in-progress Tsukkomi
  // if (associatedElement.isEditingTsukkomi) {
  //   associatedElement.removeChild(associatedElement.currentTsukkomi);
  //   associatedElement.currentTsukkomi = null;
  // }


  if (!associatedElement.isEditingTsukkomi) {

  

  associatedElement.isEditingTsukkomi = true;

  const cursorX = event.offsetX;
  const cursorY = event.offsetY;

  const tsukkomiStyle =
    { backgroundColor: '#fff'
    // , pointerEvents: 'none'
    , left: cursorX + 'px'
    , top: cursorY + 'px'
    , position: 'absolute'
    , display: 'block'
    , resize: 'none'
    , padding: '0.3em 0.5em'
    , fontSize: '0.7em'
    }

  var newTsukkomi = document.createElement('div');
  for (var i in tsukkomiStyle) {
    newTsukkomi.style[i] = tsukkomiStyle[i];
  }
  // newTsukkomi.innerText = "hey what's up";

  newTsukkomi.contentEditable = 'true';
  associatedElement.currentTsukkomi = newTsukkomi;
  associatedElement.appendChild(newTsukkomi);
  newTsukkomi.focus();
  
  // var textField = document.createElement('textarea');
  // for (var i in tsukkomiStyle) {
  //   textField.style[i] = tsukkomiStyle[i];
  // }

  // document.getElementById(id).appendChild(textField);
  // textField.focus();

  showButtons(id);
}
  if (associatedElement.setCancelEditing) {
    associatedElement.setCancelEditing = false;
    associatedElement.isEditingTsukkomi = false;
  }

}

const hideButtons = function(id) {
  document.getElementById(id + '-button-panel').style.display = 'none';
}

const showButtons = function(id) {
  const panelId = id + '-button-panel';
  if (document.getElementById(panelId)) {
    document.getElementById(panelId).style.display = 'block';
  } else {

    var associatedElement = document.getElementById(id);
    var panel = document.createElement('div');
    panel.setAttribute('id', panelId);

    var cancelButton = document.createElement('button');
    cancelButton.innerHTML = "Cancel";
    cancelButton.tsukkomiId = id;
    cancelButton.setAttribute('name', 'cancel-button');
    cancelButton.setAttribute('onclick', 'cancelButtonClick(event, this.tsukkomiId)');

    var saveButton = document.createElement('button');
    saveButton.innerHTML = "Save";
    saveButton.tsukkomiId = id;
    saveButton.setAttribute('name', 'save-button');
    saveButton.setAttribute('onclick', 'saveButtonClick(event, this.tsukkomiId)');
    panel.appendChild(cancelButton);
    panel.appendChild(saveButton);

    // var buttonHeight = element.clientHeight - cancelButton.clientHeight;
    const panelStyle =
      { position: 'absolute'
      , display: 'block'
      , top: '0'
      // , marginTop: cancelButton.clientHeight + 'px'
      }

    for (var i in panelStyle) {
      panel.style[i] = panelStyle[i];
    }
    associatedElement.appendChild(panel);

  }

  
}

const cancelButtonClick = function(event, id) {
  console.log(id);
  var associatedElement = document.getElementById(id);

  // Clear the previous in-progress Tsukkomi
  if (associatedElement.isEditingTsukkomi) {
    associatedElement.removeChild(associatedElement.currentTsukkomi);
    associatedElement.currentTsukkomi = null;
    associatedElement.setCancelEditing = true;
    hideButtons(id);
  }
}

const saveButtonClick = function(event, id) {
  console.log(id);
}

window.onload = (function() {
  insertStyle();
})();