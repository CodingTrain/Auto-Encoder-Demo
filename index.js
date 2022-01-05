console.log("Hello Autoencoder 🚂");

import * as tf from "@tensorflow/tfjs-node";
// // import canvas from "canvas";
// // const { loadImage } = canvas;
import Jimp from "jimp";
import numeral from "numeral";


const W = 28;
// variable for # of colors:  1 for greyscale and 3 for color
const c = 1;

//const images = await loadImages(1);


main();

async function main() {
  // Build the model
  const { decoderLayers, autoencoder } = buildModel();
  // load all image data
  const images = await loadImages(1100);
  
 // train the model

  const x_train = tf.tensor2d(images.slice(1000));//, [ 10, W, W, c ]);

  //x_train = tf.util.flatten(x_train);
  await trainModel(autoencoder, x_train, 20);
  const saveResults = await autoencoder.save("file://public/model/");

  console.log(autoencoder.summary());

  // const autoencoder = await tf.loadLayersModel("file://public/model/model.json");
  // test the model
  //const x_test = tf.tensor2d(images.slice(100));
  const x_test = tf.tensor2d(images.slice(100));//, [ 1, W , W, c ]);
  await generateTests(autoencoder, x_test);

  // Create a new model with just the decoder
  const decoder = createDecoder(decoderLayers);
  const saveDecoder = await decoder.save("file://public/decoder/model/");
}

async function generateTests(autoencoder, x_test) {
  const output = autoencoder.predict(x_test);

  
  //attempt at color: returning a tensor with rank 2 and shape [ 1, 2352]
  //console.log(output.slice(0,1));
  
  //output.print();

  //original code
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

  //new code getting r,g,b values
  // const newImages = await output.array();
  // for (let i = 0; i < newImages.length; i++) {
  //   const img = newImages[i];
  //   const buffer = [];
  //   for (let n = 0; n < img.length; n++) {
  //     //const val = Math.floor(img[n] * 255);
  //     buffer[n * 4 + 0] = img[n * 4 + 0] * 255;
  //     buffer[n * 4 + 1] = img[n * 4 + 1] * 255;
  //     buffer[n * 4 + 2] = img[n * 4 + 2] * 255;
  //     buffer[n * 4 + 3] = 255;
      
  //   }
    
    // let p = [];
    // for (let n = 0; n < W*W; n++) {
    // let idx = n * 4;
    //   for (let cidx=0; cidx < c; cidx++) {
    //     p.push(img.bitmap.data[idx+cidx]); 
    //   rawData[n+cidx] = p[n+cidx] / 255.0;
    //   }

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
      units: 256*c,
      inputShape: [ W*W*c ],
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 128*c,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 64*c,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 16*c,
      activation: "relu",
    })
  );
  autoencoder.add(
    tf.layers.dense({
      units: 4*c,
      activation: "sigmoid",
    })
  );
  // // How do I start from here?
  // // Decoder

  let decoderLayers = [];
  decoderLayers.push(
    tf.layers.dense({
      units: 16*c,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 64*c,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 128*c,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: 256*c,
      activation: "relu",
    })
  );
  decoderLayers.push(
    tf.layers.dense({
      units: W * W * c,
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
  let rawData = [];
  for (let i = 0; i < total; i++) {
    const num = numeral(i).format("0000");
    const img = await Jimp.read(
       `public/data/shape${num}.png`)
       .then(img => {
         return img 
          //.write('color.jpg');
        })
         .catch(err => {
           console.error(err);
         });
  
    const p = [];
    for (let n = 0; n < W*W; n++) {
    let idx = n * 4;
      for (let cidx=0; cidx < c; cidx++) {
        p.push(img.bitmap.data[idx+cidx]);
          rawData[n*c+cidx] = p[n*c+cidx] / 255.0;
        }
      }
      //console.log(rawData) ; 
      
      allImages[i] = rawData;
      //console.log(allImages[0]);
    }
    return allImages;
    
  }
    
//Maybe try in future
//code adapted from https://github.com/tensorflow/tfjs-examples/blob/master/mnist/index.js
  
  // The first layer of the convolutional neural network plays a dual role:
  // it is both the input layer of the neural network and a layer that performs
  // the first convolution operation on the input. It receives the 28x28 pixels
  // color images. This input layer uses 16 filters with a kernel size
  // of 3 pixels each. It uses a simple RELU activation function which pretty
  // much just looks like this: __/  Groups specifies the number of channels.
  // autoencoder.add(tf.layers.conv2d({
  //   inputShape: [W, W, c],
  //   dataFormat: 'channelsLast',
  //   kernelSize: 3,
  //   filters: 16,
  //   groups: 3,
  //   activation: 'relu'
  // }));

  // // // After the first layer we include a MaxPooling layer. This acts as a sort of
  // // // downsampling using max values in a region instead of averaging.
  // // // https://www.quora.com/What-is-max-pooling-in-convolutional-neural-networks
  // autoencoder.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

  // // // Our third layer is another convolution, this time with 32 filters.
  // // autoencoder.add(tf.layers.conv4d({kernelSize: 3, filters: 32, activation: 'relu'}));

  // // // Max pooling again.
  // // autoencoder.add(tf.layers.maxPooling4d({poolSize: 2, strides: 2}));

  // // // Add another conv2d layer.
  // // autoencoder.add(tf.layers.conv4d({kernelSize: 3, filters: 32, activation: 'relu'}));

  // // // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // // // it for input into our last layer. This is common practice when feeding
  // // // higher dimensional data to a final classification output layer.
  // autoencoder.add(tf.layers.flatten({}));

  // // //add a dropout layer with a dropout rate of dr
  // // autoencoder.add(tf.layers.dropout({ rate:  dr}));

  // autoencoder.add(tf.layers.dense({units: 64, activation: 'relu'}));

  // // // Our last layer is a dense layer which has 10 output units, one for each
  // // // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9). Here the classes actually
  // // // represent numbers, but it's the same idea if you had classes that
  // // // represented other entities like dogs and cats (two output classes: 0, 1).
  // // // We use the softmax function as the activation for the output layer as it
  // // // creates a probability distribution over our 10 classes so their output
  // // // values sum to 1.
  // // autoencoder.add(tf.layers.dense({units: 10, activation: 'softmax'}));
  // // return model;

  //   img.scan(0,0, img.bitmap.width, img.bitmap.height, function(x,y, idx) {
  //     for (let cidx=0; cidx < c; cidx++) {
  //       p.push()
  //     //p.push(this.bitmap.data[idx+cidx])
  //     }
  //   })
  //     for (let n = 0; n < W*W*c; n++) {
  //     rawData[n]= p[n] / 255.0;
  //     };
  //     allImages[i] = rawData;
  //     //console.log(allImages[0]);
  //   } 
  // return allImages;
  // }


//Failed Attemps to imput pixel array



//   pixels = tf.node.decodePng(img);
  //   rawData = pixels.div(255);
  //   allImages[i] = rawData;
  // }

  // stackoverflow Jimp image to Tensor node.js
//     const values = img.bitmap.data;
//     const outShape = [1, img.bitmap.width, img.bitmap.height, 4];
//     var input = tf.tensor(values, outShape);

//     // // slice away alpha
//     let rawInput = input.slice([0,0,0,0], [1, img.bitmap.width, img.bitmap.height, c]);
//     let normInput = rawInput.div(255);
//     console.log(normInput);
//     //input = tf.util.flatten(input);
//     allImages[i] = normInput;
//     }
//     console.log(allImages[0]);
    
//  return allImages;
// }
