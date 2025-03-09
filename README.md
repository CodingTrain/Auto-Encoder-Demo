Exploring autoencoders with p5 and tensorflow js 

## Autoencoders
* [Autoencoders Live Stream Part 1](https://www.youtube.com/watch?v=Y9w2PYfIf34)
* [Autoencoders Live Stream Part 2](https://www.youtube.com/watch?v=SA7W7rlyc3c)
* [Autoencoders Live Stream Part 3](https://www.youtube.com/watch?v=Ppif4qdW2pE)
* part 4 coming soon !
* [Autoencoders explained from Two Minute Papers](https://youtu.be/Rdpbnd0pCiI)
* [Autoencoders on wikipedia](https://en.wikipedia.org/wiki/Autoencoder)
* [Building Autoencoders in Keras](https://blog.keras.io/building-autoencoders-in-keras.html)

## Related topics
* [Coding train tensorflow.js playlist](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YIeVA3dNxbR9PYj4wV31oQ)
* [Coding train neural network playlist](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh)

## Introduction

This definition of machine learning, adapted from "Deep Learning with Javascript:  Neural Networks in Tensorflow.js", encapsulates the purpose of the autoencoder nicely:  "finding an appropriate transformation that turns the old representation of the input data into a new one".  In this case, the data is the pixel values in a (28*28 or 56*56) image of randomly sized circles or aquares generated in Processing.  The role of the autoencoder is to develop a model which will learn how to produce new images based on a new input (a new shape, random noise, etc.).  The model consists of weights that will be applied to each neuron (pixel) in each layer.  Starting at the final layer, the weights are determined by calculating the difference between the predicted pixel array and the actual pixel array (error), for each image in a random batch of 32 images in the training data. Epochs specify how many times this process is repeated. This calculation is repeated in backwards fashion for each layer of the autoencoder. 

 Once the weights are calculated, they are stored in a json file in the model folder.  Given the model weights, the model is then tested by  imputing the test images.  Once the model is built, the weights are frozen, and the decoder model can be used to regerate new images based on the input fed to the decoder.  This input could be images of circles or squares (with or without noise) or pure random noise.  A practical example of this is an activity tracker.  

Key concepts:

1.  Neural Network:  composed of an input layer, one or more hidden layers, and an output layer.  Our input layer is the array containing the normalized r values for each pixel

2.  Sequential model:  the layers are architacked in a linear sequence.

``const autoencoder = tf.sequential();``

3.  Fullly-Connected or Dense Layer:  defined as "deeply connected" to the preceding layer (ie. every neuron of the layer is connected to every neuron in its preceding layer.)  The input to a dense layer must be a 1d array.

`` autoencoder.add(tf.layers.dense{}));``

3.  Convolutional Layer: this algorithm takes subsets of the tensor (based on the size of the kernal).  Only the nodes within the subsample are fully connected. 

``autoencoder.add(tf.layers.conv2d({}));``

4. Pooling layer, which downsamples the nodes, is often used is conjuction with the convolutional layer

A convolutional layer and pooling layer used together are referred to as a convolutional block.

``autoencoder.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));``

If your images are grey scale (and therefore you are only using the r channel), it is OK to start with dense layers.  However, if you want to include 3 channels, you need to use a convolutional network.  Because the images each have an input shape of W*W*3, the number of neurons gets very large as the resolution of the image increases.  


4.  Gradient Descent:  A really good analogy is descending a steep mountain trail in the dark, when you only have the narrow beam of a flashlight to guide you. You will make small steps trying to get to the bottom of the mountain, taken from "Make Your Own Neural Network".  Each small step is analogous to the learning rate.  If there is only one mountain peak, given enough time you will eventually reach the bottom.  However, if there are many peaks with valleys, it is possible you will not reach the local value but not reach the base of the mountain.  For this reason, it is a best practice to train on small groups of samples (batches) and shuffle the samples.

5.  Normalization:  The inputs into the last layer of the model are passed throught the sigmoid activation function, which is bounded between -1 and 1, therefore we divide by 255:

``rawData[n*c+cidx] = p[n*c+cidx] / 255.0;``

## Key Model Hyperparameters for neural network

1.  Activation Function The activation function is a nonlinear, differentiable function that is used to improve the efficiency of the model(relu, sigmoid) over plain linear regression.
2.  Learning Rate:  the rate at which the weights are adjusted.
3.  Optimizer:  adam
4.  Kernal size:  subset of the image tensor
5.  Input Shape:  number of nodes going into each layer
6.  Units: number of nodes coming out of each layer.  
7.  Accuracy:  perceptange of correct predictions
    Note:  can be misleading which is why loss is used to monitor how well the model is doing
8.  Loss: "MeanSquaredError",  a measure of the difference between the actual image and predicted image.
9.  Drop out rate - percentage of inputs that are dropped from a layer to add randomness to the training and help prevent overfitting 

## Hyperparameters that control output size (units) of convolutional blocks

1.  depth:  corresponds the the number of filters (can be thought of as separate parameters, i.e. shape, radius, colors)
2.  stride: number of pixels by which the filter is moved across the array to sample
3.  zero-padding: do you want to pad with zeros around the outside of the tensor.  This is helpful if you want to ensure that you are capturing the information at the perimeter of the tensor.
4.  The formula to determine output size of convolutional layer, W1*W1*D1, where W1 = (W - F + 2 * P)/S + 1

W1 = width of image
F = number of filters
P = amount of zero padding
S = strides
+1 accounts for the bias
D = depth (# of colors)  

5. The formula to determine the output shape of the pooling layer is W2*W2*D, where 

W2 = (W1 - F)/S + 1

A detailed explanation of these formulas and a very nice animation can be found here at https://cs231n.github.io/convolutional-networks/#conv

## Training with grey scale versus color images

Each image is a 3D tensor with (height-width-channel).  A batch of images is a 4D tensor, where the additional dimension is the number of images (NHWC).

--If you are training/testing grey scale images, declare 2d tensors.

``const x_train = tf.tensor2d(images.slice(0, 1000), [ 1, W, W, c ]);``

--If you are training/testing color images, declare 4d tensors. 

``const x_train = tf.tensor4d(images.slice(1000), [ 1, W , W, c ]);``

##  p5.js implementation

createGraphics(w, h, [renderer]) creates an off-screen graphics buffer.  (In example in p5.js appearance of object changes. 

## Libraries 

1.  tensorflow.js

1.  Jimp:  used to read in pixel data from the images created in Processing/P5JS and write new images to a file.

2.  Numeral: used to efficiently refer to each image during the read/write process

  
## Important 

1.  Each time the program is run, tensors are created.  You need to make sure that you are disposing of them using tidy() or your computer memory will fill up with tensors and slow down your computer.

2.  Each layer of stacking convolutional blocks will reduce the number of nodes.  It is possible to go too far (especially if you start with a small resolution) and you will get a somewhat cryptic error that you have passed a null tensor.  The output of the last convolutional layer needs to be [1,1, number of filters], ie you must pass a 1d array to the first dense layer.

##  Additional Reading

Deep Learning with Javascript:  Neural Networks in Tensorflow.js, Shanging Cai, Stanley Bileschi, Eric Nielsen, Fransois Chollet

Make Your Own Neural Network, Tariq Rashid

Understanding and implementing a fully convolutional network (FCN), Himanshu Rawiani, https://towardsdatascience.com/implementing-a-fully-convolutional-network-fcn-in-tensorflow-2-3c46fb61de3b