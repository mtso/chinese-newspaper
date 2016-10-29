// Tsukkomi

'use strict';

window.onload = function() {
  insertStyle();

  const tsukkomiEnabled = document.getElementsByClassName('tsukkomi-enabled');

  for(var i = 0; i < tsukkomiEnabled.length; ++i) {
    addTsukkomiPanelTo(tsukkomiEnabled[i]);
  }
};

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

  if (!associatedElement.isEditingTsukkomu) {
    associatedElement.isEditingTsukkomu = true;

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

    var newTsukkomu = document.createElement('div');
    for (var i in tsukkomiStyle) {
      newTsukkomu.style[i] = tsukkomiStyle[i];
    }

    newTsukkomu.xPosition = cursorX;
    newTsukkomu.yPosition = cursorY;
    newTsukkomu.associatedImage = id;

    newTsukkomu.contentEditable = 'true';
    associatedElement.currentTsukkomu = newTsukkomu;
    associatedElement.appendChild(newTsukkomu);
    newTsukkomu.focus();
    
    showEditButtons(id);
  }
}

const hideEditButtons = function(id) {
  document.getElementById(id + '-edit-panel').style.display = 'none';
}

const showEditButtons = function(id) {
  const panelId = id + '-edit-panel';
  
  if (document.getElementById(panelId)) {
    document.getElementById(panelId).style.display = 'block';
  } 
  else {

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

    const panelStyle =
      { position: 'absolute'
      , display: 'block'
      , top: '20'
      }

    for (var i in panelStyle) {
      panel.style[i] = panelStyle[i];
    }
    associatedElement.appendChild(panel);
  }
}

const cancelButtonClick = function(event, id) {
  event.stopPropagation();

  console.log(id);
  var associatedElement = document.getElementById(id);

  // Clear the previous in-progress Tsukkomu
  if (associatedElement.isEditingTsukkomu) {
    associatedElement.removeChild(associatedElement.currentTsukkomu);
    associatedElement.currentTsukkomu = null;
    associatedElement.isEditingTsukkomu = false;
    hideEditButtons(id);
  }
}

const saveButtonClick = function(event, id) {
  event.stopPropagation();

  var associatedElement = document.getElementById(id);

  if (associatedElement.isEditingTsukkomu && 
      associatedElement.currentTsukkomu.innerHTML != '') {
    var tsukkomuToSave = associatedElement.currentTsukkomu;
    tsukkomuToSave.style.pointerEvents = 'none';
    tsukkomuToSave.contentEditable = 'false';
    saveTsukkomu(tsukkomuToSave);

    associatedElement.currentTsukkomu = null;
    associatedElement.isEditingTsukkomu = false;
    hideEditButtons(id);
  }
}

const saveTsukkomu = function(tsukkomu) {
  var saveObject =
    { text: tsukkomu.innerHTML
    , xPosition: tsukkomu.xPosition
    , yPosition: tsukkomu.yPosition
    , tsukkomiId: tsukkomu.associatedImage
    }

  var objectString = JSON.stringify(saveObject);
  console.log(objectString);
}

const viewButtonClick = function(event, id) {
  event.stopPropagation();
  var target = event.target;
  var viewPanel = document.getElementById(id + '-view-panel');

  target.showTsukkomis = !target.showTsukkomis;

  if (target.showTsukkomis) {
    target.innerHTML = "Hide Tsukkomis";
    viewPanel.nextButton.style.display = 'inline';
    viewPanel.prevButton.style.display = 'inline';

    loadTsukkomiDivFor(id);
  } else {
    target.innerHTML = "Show Tsukkomis";
    viewPanel.nextButton.style.display = 'none';
    viewPanel.prevButton.style.display = 'none';
  }
}

const initialTsukkomiUrlFor = function(id) {
  return 'http://' + window.location.host + 
    '/comments?tsukkomi_id=' + id + 
    '&_page=1';
}

const setTsukkomiPageFor = function(associatedElement, url) {
  var viewPanel = document.getElementById(associatedElement.id + '-view-panel');

  httpGetAsync(url, function(res) {

    var links = parseLinkHeader(res.getResponseHeader('Link'));

    var currentTsukkomiData = JSON.parse(res.responseText);
    console.log(currentTsukkomiData);

    associatedElement.tsukkomisForCurrentPage = currentTsukkomiData;
    associatedElement.nextPageUrl = links['next'] ? links['next'] : null;
    associatedElement.prevPageUrl = links['prev'] ? links['prev'] : null;
    associatedElement.currentPageUrl = url;

    viewPanel.nextButton.disabled = links['next'] ? false : true;
    viewPanel.prevButton.disabled = links['prev'] ? false : true;
  });
}

const loadTsukkomiDivFor = function(id) {
  var associatedElement = document.getElementById(id);
  const containerId = id + '-tsukkomis';
  
  var container = document.getElementById(containerId);
  if (!container) {

    container = document.createElement('div');
    container.setAttribute('id', containerId);

    const containerStyle =
      { position: 'absolute'
      , display: 'block'
      // , zIndex: 200
      // , width: 100%
      // , height: 100%
      , top: '0'
      }

    for (var i in containerStyle) {
      container.style[i] = containerStyle[i];
    }
    associatedElement.appendChild(container);
  }
  // console.log(associatedElement.tsukkomisForCurrentPage);
  for (var tsukkomuData of associatedElement.tsukkomisForCurrentPage) {
    const tsukkomiStyle =
      { backgroundColor: '#fff'
      , pointerEvents: 'none'
      , left: tsukkomuData.xPosition + 'px'
      , top: tsukkomuData.yPosition + 'px'
      , position: 'absolute'
      , display: 'inline-block'
      , resize: 'none'
      , padding: '0.3em 0.5em'
      , fontSize: '0.7em'
      }

    var tsukkomu = document.createElement('div');
    for (var i in tsukkomiStyle) {
      tsukkomu.style[i] = tsukkomiStyle[i];
    }

    tsukkomu.innerHTML = tsukkomuData['body'];
    container.appendChild(tsukkomu)
  }
}

const addTsukkomiPanelTo = function(element) {
  const panelId = element.id + '-view-panel';

  var panel = document.createElement('div');
  panel.setAttribute('id', panelId);

  var viewButton = document.createElement('button');
  viewButton.innerHTML = "Show Tsukkomis";
  viewButton.tsukkomiId = element.id;
  viewButton.setAttribute('name', 'view-button');
  viewButton.setAttribute('onclick', 'viewButtonClick(event, this.tsukkomiId)');

  var prevButton = document.createElement('button');
  prevButton.innerHTML = "<";
  prevButton.disabled = true;
  prevButton.style.display = 'none';

  var nextButton = document.createElement('button');
  nextButton.innerHTML = ">";
  nextButton.disabled = false;
  nextButton.style.display = 'none';

  panel.appendChild(viewButton);
  panel.appendChild(prevButton);
  panel.appendChild(nextButton);

  panel.viewButton = viewButton;
  panel.prevButton = prevButton;
  panel.nextButton = nextButton;

  const panelStyle =
    { position: 'absolute'
    , display: 'block'
    , top: '0'
    }

  for (var i in panelStyle) {
    panel.style[i] = panelStyle[i];
  }
  element.appendChild(panel);

  element.showTsukkomis = false;
  setTsukkomiPageFor(element, initialTsukkomiUrlFor(element.id));
}

const httpGetAsync = function(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


// UTILITIES

// parse a Link header
//
// Link:<https://example.org/.meta>; rel=meta
//
// var r = parseLinkHeader(xhr.getResponseHeader('Link');
// r['meta'] outputs https://example.org/.meta
//
const parseLinkHeader = function(link) {
    var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
    var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

    var matches = link.match(linkexp);
    var rels = {};
    for (var i = 0; i < matches.length; i++) {
        var split = matches[i].split('>');
        var href = split[0].substring(1);
        var ps = split[1];
        var s = ps.match(paramexp);
        for (var j = 0; j < s.length; j++) {
            var p = s[j];
            var paramsplit = p.split('=');
            var name = paramsplit[0];
            var rel = paramsplit[1].replace(/["']/g, '');
            rels[rel] = href;
        }
    }
    return rels;
}