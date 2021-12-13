console.log("Hello Autoencoder 🚂");

import * as tf from "@tensorflow/tfjs-node-gpu";
// import canvas from "canvas";
// const { loadImage } = canvas;
import Jimp from "jimp";
import numeral from "numeral";

const W = 28;

main();

async function main() {

  console.log(`Using backend: ${tf.getBackend()}`)

  // Build the model
  const { decoder, autoencoder } = buildModel();
  // load all image data
  const images = await loadImages(7000);
  // train the model
  const x_train = tf.tensor2d(images.slice(0, 5600));
  await trainModel(autoencoder, x_train, 15);
  const saveResults = await autoencoder.save("file://public/model/");

  // const autoencoder = await tf.loadLayersModel("file://public/model/model.json");
  // test the model
  const x_test = tf.tensor2d(images.slice(5000));
  await generateTests(autoencoder, x_test);

  // Create a new model with just the decoder
  //const decoder = createDecoder(decoder);
  const saveDecoder = await decoder.save("file://public/decoder/model/");
}

async function generateTests(autoencoder, x_test) {
  const output = autoencoder.predict(x_test);
  // output.print();

  const newImages = await output.array();
  for (let i = 0; i < newImages.length; i++) {
    const img = newImages[i];
    const buffer = [];
    for (let n = 0; n < img.length; n++) {
      const val = Math.floor(img[n] * 255);
      buffer[n * 4 + 0] = val;
      buffer[n * 4 + 1] = val;
      buffer[n * 4 + 2] = val;
      buffer[n * 4 + 3] = 255;
    }
    const image = new Jimp(
      {
        data: Buffer.from(buffer),
        width: W,
        height: W,
      },
      (err, image) => {
        const num = numeral(i).format("0000");
        image.write(`output/square${num}.png`);
      }
    );
  }
}

function createDecoder(decoder) {

   const learningRate = 0.0001;
   const optimizer = tf.train.adam(learningRate, 0.0000001); // adam(learning_rate, decay)
  decoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  return decoder;
}

function buildModel() {


// encoder
  const encoder_input = tf.input({shape: [W*W], name: "encoder_input"});
 // const l0 = tf.layers.flatten().apply(encoder_input);
  const l1 = tf.layers.dense({units: 128, activation: "relu"}).apply(encoder_input);
  const l2 = tf.layers.dense({units: 64, activation: "relu"}).apply(l1);
  const l3 = tf.layers.dense({units: 16, activation: "relu"}).apply(l2);
  const l4 = tf.layers.dense({units: 4, activation: "relu"}).apply(l3);
  let encoded = tf.layers.dense({units: 2, activation: "relu", name: "encoder_output"}).apply(l4);
  
  let encoder = tf.model({inputs: encoder_input, outputs: encoded, name: "encoder"});
  console.log(`Encoder Summary: ${encoder.summary()}`);

  const decoder_input = tf.input({shape: [2]});
  let decoder = tf.layers.dense({units: 4, activation: "relu", name: "decoder_input"}).apply(decoder_input);
  const l6 = tf.layers.dense({units: 16, activation: "relu"}).apply(decoder);
  const l7 = tf.layers.dense({units: 64, activation: "relu"}).apply(l6);
  const l8 = tf.layers.dense({units: 128, activation: "relu"}).apply(l7);
  let decoded = tf.layers.dense({units: 784, activation: "sigmoid", name: "decoder_output"}).apply(l8);

  decoder = tf.model({inputs: decoder_input, outputs: decoded, name: "decoder"});
  console.log(`Decoder Summary: ${decoder.summary()}`);


  const auto = tf.input({shape: [W*W]});
  encoded = encoder.apply(auto);
  decoded = decoder.apply(encoded);

  const autoencoder = tf.model({inputs: auto, outputs: decoded, name: "autoencoder"});
  console.log(`Autoencoder Summary: ${autoencoder.summary()}`);

 
  const learningRate = 0.0001;
  const optimizer = tf.train.adam(learningRate, 0.000001); // adam(learning_rate, decay)
  
  autoencoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  decoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError"
  });
  return { decoder, autoencoder};
}

async function trainModel(autoencoder, x_train, epochs) {
  await autoencoder.fit(x_train, x_train, {
    epochs: epochs,
    batch_size: 32,
    shuffle: true,
    verbose: true,
    validation_split: 0.1
  });
}

async function loadImages(total) {
  const allImages = [];
  for (let i = 0; i < total; i++) {
    const num = numeral(i).format("0000");
    const img = await Jimp.read(
      `data/square${num}.png`
    );

    let rawData = [];
    for (let n = 0; n < W * W; n++) {
      let index = n * 4;
      let r = img.bitmap.data[index + 0];
      // let g = img.bitmap.data[n + 1];
      // let b = img.bitmap.data[n + 2];
      rawData[n] = r / 255.0;
    }
    allImages[i] = rawData;
  }
  return allImages;
}
