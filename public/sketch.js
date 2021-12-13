let autoencoder;
const W = 28;
let w;

let diam;
let inputCanvas;

let testImages = [];

// function preload() {
//   for (let i = 0; i < 11; i++) {
//     testImages[i] = loadImage(`data/square${nf(i, 4)}.png`);
//   }
// }

async function setup() {
  createCanvas(560, 280);
  inputCanvas = createGraphics(W, W);
  w = height / W;
  diam = 25 / w;
  inputImg = new Array(W * W);
  outputImg = new Array(W * W);
  for (let i = 0; i < W * W; i++) {
    inputImg[i] = random(1);
    outputImg[i] = random(1);
  }
  autoencoder = await tf.loadLayersModel("model/model.json");
  await nextImage();
}

// let testIndex = 0;
// function mousePressed() {
//   testIndex++;
// }

async function nextImage() {
  inputCanvas.background(255);
  // inputCanvas.image(testImages[testIndex], 0, 0, W, W);
  inputCanvas.stroke(0);
  inputCanvas.strokeWeight(16 / w);
  inputCanvas.noFill();
  diam += 0.1;
  if (diam > W) {
    diam = 0 / w;
  }
  inputCanvas.rectMode(CENTER);

  if (mouseIsPressed) {
    inputCanvas.square(W / 2, W / 2, diam);
  } else {
    inputCanvas.circle(W / 2, W / 2, diam);
  }

  for (let i = 0; i < 500; i++) {
    let x = random(W);
    let y = random(W);
    inputCanvas.strokeWeight(0.5);
    inputCanvas.stroke(100);
    inputCanvas.point(x, y);
  }

  let testImage = createImage(W, W);
  testImage.copy(inputCanvas, 0, 0, W, W, 0, 0, W, W);
  testImage.loadPixels();
  for (let i = 0; i < W * W; i++) {
    inputImg[i] = testImage.pixels[i * 4] / 255;
  }
  const x_test = tf.tensor2d([inputImg]);
  const output = autoencoder.predict(x_test);
  outputImg = (await output.array())[0];
  nextImage();
}

function draw() {
  background(255);
  // render(inputImg, 0, 0);
  // image(testImages[testIndex], 0, 0, W * w, W * w);
  image(inputCanvas, 0, 0, W * w, W * w);
  render(outputImg, W * w, 0);
}

function render(imgArray, x, y) {
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < W; j++) {
      let val = imgArray[i + j * W];
      fill(val * 255);
      noStroke();
      square(x + i * w, j * w, w);
    }
  }
}
