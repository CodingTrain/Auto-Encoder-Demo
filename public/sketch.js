let autoencoder;
let zoff = 0;
let inc = 0.2;
const W = 56;
let w;

async function setup() {
  createCanvas(560, 280);
  w = height / W;
  inputImg = new Array(W * W);
  outputImg = new Array(W * W);
  for (let i = 0; i < W * W; i++) {
    inputImg[i] = random(1);
    outputImg[i] = random(1);
  }
  autoencoder = await tf.loadLayersModel("model/model.json");
  await nextImage();
}

async function nextImage() {
  // for (let i = 0; i < W * W; i++) {
  //   inputImg[i] = random(1);
  // }
  let xoff = 0;
  for (let i = 0; i < W; i++) {
    let yoff = 0;
    for (let j = 0; j < W; j++) {
      let value = noise(xoff, yoff, zoff);
      inputImg[i + j * W] = value;
      yoff += inc;
    }
    xoff += inc;
  }
  zoff += inc * 0.1;
  const x_test = tf.tensor2d([inputImg]);
  const output = autoencoder.predict(x_test);
  outputImg = (await output.array())[0];
  nextImage();
}

function draw() {
  background(255);
  render(inputImg, 0, 0);
  render(outputImg, W * w, 0);
}

function render(imgArray, x, y) {
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < W; j++) {
      fill(imgArray[i + j * W] * 255);
      noStroke();
      square(x + i * w, j * w, w);
    }
  }
}
