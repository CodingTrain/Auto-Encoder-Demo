Exploring autoencoders with p5 and tensorflow js 

## Autoencoders
* [Autoencoders Live Stream Part 1](https://www.youtube.com/watch?v=Y9w2PYfIf34)
* [Autoencoders Live Stream Part 2](https://www.youtube.com/watch?v=SA7W7rlyc3c)
* [Autoencoders Live Stream Part 3](https://www.youtube.com/watch?v=Ppif4qdW2pE)
* part 4 coming soon !
* [Autoencoders explained from Two Minute Papers](https://www.youtube.com/watch?v=nTt_ajul8NY)
* [Autoencoders on wikipedia](https://en.wikipedia.org/wiki/Autoencoder)
* [Building Autoencoders in Keras](https://blog.keras.io/building-autoencoders-in-keras.html)

## Related topics
* [Coding train tensorflow.js playlist](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YIeVA3dNxbR9PYj4wV31oQ)
* [Coding train neural network playlist](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh)


## Introduction

This definition of machine learning, adapted from "Deep Learning with Javascript:  Neural Networks in Tensorflow.js", encapsulates the purpose of the autoencoder nicely:  "finding an appropriate transformation that turns the old representation of the input data into a new one".  In this case, the data is the pixel values in a (28*28 or 56*56) image of randomly sized circles or aquares generated in Processing.  The role of the autoencoder is to develop a model which will learn how to produce new images based on a new input (a new shape, random noise, etc.).

 The job of the autoencoder is to build a model 
 
 the weights that will be applied to each neuron (pixel) in each layer.  Starting at the final layer, the weights are determined by calculating the difference between the predicted pixel array and the actual pixel array (error), for each image in a random batch of 32 images in the training data. Epochs specified how many times this process is repeated. This calculation is repeated in backwards fashion for each layer of the autoencoder. 

 Once the weights are calculated, they are stored in a json file in the model folder.  Given the model weights, it is possible to create new images by imputing test data.  The test images could be images of circles or squares (with or without noise) or pure random noise. 

Key concepts:

1.  Neural Network:  composed of an input layer, one or more hidden layers, and an output layer Our input layer is the array containing the normalized r(g,b) values for each pixel

2.  Gradient Descent:  A really good analogy is descending a steep mountain trail in the dark, when you only have the narrow beam of a flashlight to guide you. You will make small steps trying to get to the bottom of the mountain, taken from "Make Your Own Neural Network".  Each small step is analogous to the learning rate.  If there is only one mountain peak, given enough time you will eventually reach the bottom.  However, if there are many peaks with valleys, it is possible you will not reach the local value but not reach the base of the mountain.  For this reason, it is a best practice to train on small groups of samples (batches) and shuffle the samples.

3. Drop out - random elements in the input tensor are dropped to add randomness tothe training and help prevent overfitting

## Key Model Hyperparameters:

1.  Activation Function The activation function is a nonlinear, differentiable function that is used to improve the efficiency of the model("relu", sigmoid) over plain linear regression.
2.  Learning Rate:  the rate at which the weights are adjusted.
3.  Optimizer:  adam
4.  Input Shape:  number of nodes going into each layer, W*W
5.  Units: number of nodes coming out of each layer.  The nodes 
6.  Accuracy:  perceptange of correct predictions
    Note:  can be misleading which is why loss is used to monitor how well the model is doing
7.  Loss: "MeanSquaredError", in this case a measure of the difference between the actual image and predicted image.
8.  Drop out rate - percentage of inputs dropped in a layer                                                                                                 


## Training with color images

Each image is a 3D tensor with (height-width-channel).  The batch of images is a 4D tensor, where the additional dimension is the number of images (NHWC)


## Libraries 

1.  Jimp:  used to read in pixel data from the images created in Processing/P5JS and write new images to a file.

2.  Numeral: used to efficiently refer to each image during the read/write process

  
