console.log("Hello Autoencoder 🚂");

import * as tf from "@tensorflow/tfjs-node";
// import canvas from "canvas";
// const { loadImage } = canvas;
import Jimp from "jimp";
import numeral from "numeral";

const W = 56;

main();

async function main() {
  // Build the model
  const autoencoder = buildModel();
  // load all image data
  const images = await loadImages(1100);
  // train the model
  const x_train = tf.tensor2d(images.slice(0, 1000));
  await trainModel(autoencoder, x_train, 100);
  const saveResults = await autoencoder.save("file://public/model/");

  // const autoencoder = await tf.loadLayersModel("file://model/model.json");
  // test the model
  const x_test = tf.tensor2d(images.slice(1000));
  await generateTests(autoencoder, x_test);
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

function buildModel() {
  const autoencoder = tf.sequential();
  // Build the model

  // Encoder
  autoencoder.add(
    tf.layers.dense({
      units: 256,
      inputShape: [W * W],
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 128,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 8,
      activation: "relu",
    })
  );

  // How do I start from here?

  // Decoder
  autoencoder.add(
    tf.layers.dense({
      units: 128,
      activation: "sigmoid",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 256,
      activation: "sigmoid",
    })
  );

  autoencoder.add(
    tf.layers.dense({
      units: W * W,
      activation: "sigmoid",
    })
  );
  autoencoder.compile({
    optimizer: "adam",
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });
  return autoencoder;
}

async function trainModel(autoencoder, x_train, epochs) {
  await autoencoder.fit(x_train, x_train, {
    epochs: epochs,
    batch_size: 32,
    shuffle: true,
    verbose: true,
  });
}

async function loadImages(total) {
  const allImages = [];
  for (let i = 0; i < total; i++) {
    const num = numeral(i).format("0000");
    const img = await Jimp.read(
      `AutoEncoder_TrainingData/data/square${num}.png`
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
