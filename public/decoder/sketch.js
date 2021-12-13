let decoder;
const W = 28;
let w;
let sliders = [];
let outputImg;
let latentTotal = 4;

async function setup() {
  createCanvas(280, 280);
  for (let i = 0; i < latentTotal; i++) {
    sliders.push(createSlider(0, 1, 0.5, 0.01));
  }
  w = width / W;
  outputImg = new Array(W * W);
  for (let i = 0; i < W * W; i++) {
    outputImg[i] = random(1);
  }
  decoder = await tf.loadLayersModel("model/model.json");
  await nextImage();
}

async function nextImage() {
  let z = [];
  for (let i = 0; i < latentTotal; i++) {
    z[i] = sliders[i].value();
  }
  const x_test = tf.tensor2d([z]);
  const output = decoder.predict(x_test);
  // output.print();
  outputImg = (await output.array())[0];
  await nextImage();
}

function draw() {
  background(255);
  render(outputImg, 0, 0);
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
