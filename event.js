// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.get === 'image') {
//     chrome.tabs.captureVisibleTab(function(screenshotUrl) {
//       alert(screenshotUrl);
//     })
//   }
// });

setTimeout(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {get: 'data'}, function(response) {
      console.log(response);
      $.post('https://htn17-processing-kshen3778.c9users.io/createHeatMap', response, function(data) {
        console.log(data)
      }, 'json');
    })
  });
}, 10000);
