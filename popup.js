// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

 /**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
var state = 1;
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('dropdown');
    var options = document.getElementById('options');
    var toggle = document.getElementById('toggle');
    // Load the saved background color for this page and modify the dropdown
    // value, if needed.
    getSavedBackgroundColor(url, (savedColor) => {
      if (savedColor) {
        changeBackgroundColor(savedColor);
        dropdown.value = savedColor;

      }
    });

    // Ensure the background color is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
      changeBackgroundColor(dropdown.value);
      saveBackgroundColor(url, dropdown.value);
    });
    options.addEventListener('click', () => {
        console.log("xfer");
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
    toggle.addEventListener('click', () => {
        if(state){
            state = 0;
            startCamera();
        }else{
            state=1;
            endCamera();
        }
    });

  });
});

window.onload = function() {
    startCamera = function() {
        console.log("starting camera...")
        webgazer.setRegression('ridge') /* currently must set regression and tracker */
            .setTracker('clmtrackr')
            .setGazeListener(function(data, clock) {
                if (data) {
                    var values = {
                        x: data.x,
                        y: data.y,
                        time: clock
                    }
                }
                console.log(values);
                //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
            })
            .begin()
            .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

        var width = 320;
        var height = 240;
        var topDist = '0px';
        var leftDist = '0px';

        var setup = function() {
            var video = document.getElementById('webgazerVideoFeed');
            video.style.display = 'block';
            video.style.position = 'absolute';
            video.style.top = topDist;
            video.style.left = leftDist;
            video.width = width;
            video.height = height;
            video.style.margin = '0px';

            webgazer.params.imgWidth = width;
            webgazer.params.imgHeight = height;

            var overlay = document.createElement('canvas');
            overlay.id = 'overlay';
            overlay.style.position = 'absolute';
            overlay.width = width;
            overlay.height = height;
            overlay.style.top = topDist;
            overlay.style.left = leftDist;
            overlay.style.margin = '0px';

            document.body.appendChild(overlay);

            var cl = webgazer.getTracker().clm;

            function drawLoop() {
                requestAnimFrame(drawLoop);
                overlay.getContext('2d').clearRect(0,0,width,height);
                if (cl.getCurrentPosition()) {
                    cl.draw(overlay);
                }
            }
            drawLoop();
        };

        function checkIfReady() {
            if (webgazer.isReady()) {
                setup();
            } else {
                setTimeout(checkIfReady, 100);
            }
        }
        setTimeout(checkIfReady,100);
    }

    endCamera = function(){
        console.log("stopping camera...")
        webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    }
};

window.onbeforeunload = function() {
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}



