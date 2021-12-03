
  var myCapture, // camera
  myVida;    // VIDA
  
function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(320, 240);
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();
    console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      myCapture.width + ' ' + myCapture.height
    );
  } catch(_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  createCanvas(640, 480); // we need some space...
  initCaptureDevice(); // and access to the camera

  /*
    VIDA stuff. One parameter - the current sketch - should be passed to the
    class constructor (thanks to this you can use Vida e.g. in the instance
    mode).
  */
  myVida = new Vida(this); // create the object
  /*
    Turn off the progressive background mode (we will use a static background
    image).
  */
  myVida.progressiveBackgroundFlag = false;
  /*
    You may need a horizontal image flip when working with the video camera.
    If you need a different kind of mirror, here are the possibilities:
      [your vida object].MIRROR_NONE
      [your vida object].MIRROR_VERTICAL
      [your vida object].MIRROR_HORIZONTAL
      [your vida object].MIRROR_BOTH
    The default value is MIRROR_NONE.
  */
  //myVida.mirror = myVida.MIRROR_HORIZONTAL; // uncomment if needed
  /*
    The value of the threshold for the procedure that calculates the threshold
    image. The value should be in the range from 0.0 to 1.0 (float).
  */
  myVida.imageFilterThreshold = 0.1;

  frameRate(30); // set framerate
}

function draw() {
  if(myCapture !== null && myCapture !== undefined) { // safety first
    background(0, 0, 255);
    /*
      Call VIDA update function, to which we pass the current video frame as a
      parameter. Usually this function is called in the draw loop (once per
      repetition).
    */
    myVida.update(myCapture);
    /*
      Now we can display images: source video and subsequent stages of image
      transformations made by VIDA.
    */
    image(myCapture, 0, 0);
    image(myVida.backgroundImage, 320, 0);
    image(myVida.differenceImage, 0, 240);
    image(myVida.thresholdImage, 320, 240);
    // let's also describe the displayed images
    noStroke(); fill(255, 255, 255);
    text('camera', 20, 20);
    text('vida: static background image', 340, 20);
    text('vida: difference image', 20, 260);
    text('vida: threshold image', 340, 260);
  }
  else {
    /*
      If there are problems with the capture device (it's a simple mechanism so
      not every problem with the camera will be detected, but it's better than
      nothing) we will change the background color to alarmistically red.
    */
    background(255, 0, 0);
  }
}

/*
  Capture current video frame and put it into the VIDA's background buffer.
*/
function touchEnded() {
  if(myCapture !== null && myCapture !== undefined) { // safety first
    myVida.setBackgroundImage(myCapture);
    console.log('background set');
  }
}