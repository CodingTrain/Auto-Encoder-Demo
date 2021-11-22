import mnist from 'mnist'
import tf from '@tensorflow/tfjs-node'

/**
 * Load data from the mnist data set
 */
export class MnistDataSource {
    constructor(countTraining = 1000, countTest = 10) {
        const { training, test } = mnist.set(countTraining, countTest)
        this.training = training.map(x => x.input)
        this.test = test.map(x => x.input)
    }

    getTrainingData() {
        return tf.tensor(this.training)
    }
    getTestData() {
        return tf.tensor(this.test)
    }
}
