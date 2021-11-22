import tf from '@tensorflow/tfjs-node'

/**
 * Generate random noise as a data set
 */
export class RandomDataSource {
    constructor(countTraining = 1000, countTest = 10) {
        this.training = Array.from({ length: countTraining }, _ => Array.from({ length: 28*28 }, _ => getRandomInt(255) / 255))
        this.test = Array.from({ length: countTest }, _ => Array.from({ length: 28*28 }, _ => getRandomInt(255) / 255))
    }
    
    getTrainingData() {
        return tf.tensor(this.training)
    }
    getTestData() {
        return tf.tensor(this.test)
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}