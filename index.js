console.log("Hello Autoencoder 🚂");

import * as tf from "@tensorflow/tfjs-node";
// // import canvas from "canvas";
// // const { loadImage } = canvas;
import Jimp from "jimp";
import numeral from "numeral";


const 
W = 28;

main();

async function main() {
  // Build the model
  const { decoderLayers, autoencoder } = buildModel();
  // load all image data
  const images = await loadImages(110);
  
 // train the model
  const x_train = tf.tensor2d(images.slice(0, 100));
  await trainModel(autoencoder, x_train, 10);
  const saveResults = await autoencoder.save("file://public/model/");

  console.log(autoencoder.summary());

  // const autoencoder = await tf.loadLayersModel("file://public/model/model.json");
  // test the model
  const x_test = tf.tensor2d(images.slice(10));
  await generateTests(autoencoder, x_test);

  // Create a new model with just the decoder
  const decoder = createDecoder(decoderLayers);
  const saveDecoder = await decoder.save("file://public/decoder/model/");
}

async function generateTests(autoencoder, x_test) {
  const output = autoencoder.predict(x_test);
  output.print();

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
        image.write(`output/shape${num}.png`);
      }
    );
  }
}

function createDecoder(decoderLayers) {
  const decoder = tf.sequential();
  for (let layer of decoderLayers) {
    const newLayer = tf.layers.dense({
      units: layer.units,
      activation: layer.activation,
      inputShape: [layer.kernel.shape[0]],
    });
    decoder.add(newLayer);
    newLayer.setWeights(layer.getWeights());
  }
  // const learningRate = 0.000001;
  // const optimizer = tf.train.adam(learningRate);
  decoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  return decoder;
}

function buildModel() {
  const autoencoder = tf.sequential();
  // Build the model

  // Encoder
  autoencoder.add(
    tf.layers.dense({
      units: 1568,
      inputShape: [W * W * 3],
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 784,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 392,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 196,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 4*4,
      activation: "sigmoid",
    })
  );
  // How do I start from here?
  // Decoder

  let decoderLayers = [];
  decoderLayers.push(
    tf.layers.dense({
      units: 16*4,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 64*4,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 128*4,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 256*4,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 2352,
      activation: "sigmoid",
    })
  );

  for (let layer of decoderLayers) {
    autoencoder.add(layer);
  }

  // const learningRate = 0.001;
  // const optimizer = tf.train.adam(learningRate);
  autoencoder.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });
  return { decoderLayers, autoencoder };
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
       `public/data/shape${num}.png`)
      //  .then(img => {
      //    return img 
      //    .write('color.jpg');
      //   })
      //    .catch(err => {
      //      console.error(err);
       

//original code pulling only r value 
    // let rawData = [];
    // for (let n = 0; n < W * W; n++) {
    //   let index = n * 4;
    //   let r = img.bitmap.data[index + 0];
    //   let g = img.bitmap.data[index + 1];
    //   let b = img.bitmap.data[index + 2];
    //   rawData[r] = r / 255.0;
    //   }
    //   allImages[i] = rawData;
    // }  
    // return allImages;
    // }
    
    const p = [];
    const rawData = [];
    img.scan(0,0, img.bitmap.width, img.bitmap.height, function(x,y, idx) {
      p.push(this.bitmap.data[idx+0])
      p.push(this.bitmap.data[idx+1])
      p.push(this.bitmap.data[idx+2])
    })
    for (let n = 0; n < W*W*3; n++) {
        rawData[n] = p[n] / 255.0;
    };
    allImages[i] = rawData;
    //console.log(allImages[1]);
  }
  return allImages;
};
  

