chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.get === 'image') {
    chrome.tabs.captureVisibleTab(function(screenshotUrl) {
      alert(screenshotUrl);
    })
  }
});

setTimeout(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {get: 'data'}, function(response) {
      alert(JSON.stringify(request));
      request
        .post('https://htn17-processing-kshen3778.c9users.io/pushToFirebase')
        .send(response)
        .end(function(err, res){
          alert(err);
          alert(res);
          if (err || !res.ok) {
            alert('Oh no! error');
          } else {
            alert('yay got ' + JSON.stringify(res.body));
          }
        });
      });
  });
}, 30000);
