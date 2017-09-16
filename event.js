// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.get === 'image') {
//     chrome.tabs.captureVisibleTab(function(screenshotUrl) {
//       alert(screenshotUrl);
//     })
//   }
// });

setTimeout(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {get: 'data'}, function(data) {
      $.ajax({
        type: 'POST',
        url: 'https://htn17-processing-kshen3778.c9users.io/createHeatMap',
        data: JSON.stringify(data),
        success: success,
        contentType: "application/json",
        dataType: 'json'
      });

      function success(response) {
        console.log(response);
      }
    })
  });
}, 10000);
