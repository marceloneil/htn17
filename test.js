// var videoElement = document.createElement('video');
// videoElement.id = 'video';
// videoElement.autoplay = 'autoplay';
// videoElement.controls = 'true';

// document.getElementsByTagName('body')[0].appendChild(videoElement);

// var video = document.getElementById("video");
// var videoStream = null;

// var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};


// var videoElement = document.createElement('video');
// videoElement.id = 'video';
// videoElement.autoplay = 'autoplay';
// videoElement.controls = 'true';

// document.getElementsByTagName('body')[0].appendChild(videoElement);

// navigator.getUserMedia({
//   video: true,
//   audio: true
// },
// function(stream) {
//   console.log(stream);
//   videoStream = stream;
//   // Stream the data
//   video.src = createSrc(stream);
//   video.play();
// },
// function(error) {
//   console.log(error);
//   console.log("Video capture error: ", error.code);
// });

// console.log(webgazer);

//   webgazer.params.imgWidth = width;
//   webgazer.params.imgHeight = height;

// var overlay = document.createElement('canvas');
// overlay.id = 'overlay';
// overlay.style.position = 'absolute';
// overlay.width = width;
// overlay.height = height;
// overlay.style.top = topDist;
// overlay.style.left = leftDist;
// overlay.style.margin = '0px';

// document.body.appendChild(overlay);

// var cl = webgazer.getTracker().clm;

// function drawLoop() {
//     requestAnimFrame(drawLoop);
//     overlay.getContext('2d').clearRect(0,0,width,height);
//     if (cl.getCurrentPosition()) {
//         cl.draw(overlay);
//     }
// }
// drawLoop();
// webgazer.setGazeListener(function(data, elapsedTime) {
//     if (data == null) {
//         return;
//     }
//     var xprediction = data.x; //these x coordinates are relative to the viewport
//     var yprediction = data.y; //these y coordinates are relative to the viewport
//     console.log(xprediction);
//     console.log(yprediction);
//     //console.log(elapsedTime); //elapsed time is based on time since begin was called
// }).begin().showPredictionPoints(true);


window.onload = function() {
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
};


window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}