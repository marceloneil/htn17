document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    var dropdown = document.getElementById('dropdown');
    var options = document.getElementById('options');
    var toggle = document.getElementById('toggle');
    var state = false;

    chrome.tabs.sendMessage(tabs[0].id, {
      get: "state"
    }, function (response) {
      if (response) {
        state = response;
      } else {
        state = false;
      }
      document.getElementById("toggle").checked = state;
      console.log('On:', state);
    });

    options.addEventListener('click', function () {
      if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
      } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
      }
    });

    toggle.addEventListener('click', function () {
      if (!state) {
        state = true;
        chrome.tabs.sendMessage(tabs[0].id, {
          get: "start"
        }, function (response) {
          if (response) {
            console.log(response.message);
          }
        });
      } else {
        state = false;
        chrome.tabs.sendMessage(tabs[0].id, {
          get: "stop"
        }, function (data) {
          console.log('stopping camera...');
          CaptureAPI.captureToBase64(tabs[0], function (error, images) {
            if (error) {
              return console.error(error)
            }
            data.imgData = images[0];
            sendData(data);
          });
        });
      }
    });

  });
});

function sendData(data) {
  console.log('sending data...');
  $.ajax({
    type: 'POST',
    url: 'https://htn17-processing-kshen3778.c9users.io/createHeatMap',
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: 'json'
  });
}