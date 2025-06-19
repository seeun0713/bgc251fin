const { Responsive } = P5Template;

let faceapi;
let detections = [];

let video;
let surprise = 0;
let happiness = 0;

function setup() {
  new Responsive().createResponsiveCanvas(800, 600, 'contain', true);
  video = createCapture(VIDEO);
  video.size(64, 48);
  video.hide();

  const options = {
    withLandmarks: false,
    withExpressions: true,
    withDescriptors: false,
  };

  faceapi = ml5.faceApi(video, options, modelReady);
}

function modelReady() {
  console.log('FaceAPI ready!');
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  detections = result;

  if (detections.length > 0) {
    let expr = detections[0].expressions;
    surprise = expr.surprised || 0;
  } else {
    surprise = 0;
  }

  if (detections.length > 0) {
    let expr = detections[0].expressions;
    happiness = expr.happy || 0;
  } else {
    happiness = 0;
  }

  faceapi.detect(gotFaces);
}

function draw() {
  background('#000000');
  noStroke();

  video.loadPixels();

  let baseWidth = width / video.width;
  let baseHeight = height / video.height;

  let tileWidth, tileHeight;
  if (surprise > 0.5) {
    tileWidth = baseWidth * 1.5;
    tileHeight = baseHeight * 1.5;
  } else {
    tileWidth = baseWidth;
    tileHeight = baseHeight;
  }

  for (let idx = 0; idx < video.pixels.length / 4; idx++) {
    let column = idx % video.width; // 열 위치
    let row = floor(idx / video.width); // 행 위치

    let r = video.pixels[idx * 4];
    let g = video.pixels[idx * 4 + 1];
    let b = video.pixels[idx * 4 + 2];
    let a = video.pixels[idx * 4 + 3];

    if (surprise > 0.7) {
      fill(255 - r, 255 - g, 255 - b, a);
    } else if (happiness > 0.7) {
      fill(r, g, 0, a);
    } else {
      fill(r, g, b, a);
    }

    rect(column * tileWidth, row * tileHeight, tileWidth, tileHeight);
  }
}
