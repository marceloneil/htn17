window.onload = function() {

  setTimeout(function(){
  chrome.runtime.sendMessage({get: 'image'}, function(response) {
    console.log(response);
  });
}, 1000);

  var data = {
    x: [],
    y: [],
    clock: []
  }

  webgazer.setRegression('ridge') /* currently must set regression and tracker */
    .setTracker('clmtrackr')
    .setGazeListener(function(coordinates, clock) {
      if (coordinates) {
        data.x.push(coordinates.x);
        data.y.push(coordinates.y + window.scrollY);
        data.clock.push(clock);
      }
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

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.get === 'data') {
      sendResponse(data);
    } else if (request.image) {
      console.log(image);
    }
  });
};


window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}