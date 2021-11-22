import fs from 'fs'
import sharp from 'sharp'
import tf from '@tensorflow/tfjs-node'

/**
 * Loads images from the images directory and processes them to fit the model
 */
export class ArbitraryImageDataSource {
    constructor(countTraining = 1000, countTest = 10) {
        const files = fs.readdirSync('images')
            .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'))
            .map(f => `images/${f}`)

        this.trainingFiles = files.shuffle().slice(0, countTraining)
        this.testFiles = files.shuffle().slice(0, countTest)
    }

    async getTrainingData() {
        const data = await Promise.all(this.trainingFiles.map(f => this._processImageFile(f)))
        return tf.tensor(data).div(255)
    }

    async getTestData() {
        const data = await Promise.all(this.testFiles.map(f => this._processImageFile(f)))
        return tf.tensor(data).div(255)
    }

    _processImageFile(filename) {
        return sharp(filename)
            .resize(28, 28, {
                fit: 'cover'
            })
            .gamma()
            .greyscale()
            .raw()
            .toBuffer()
    }
}

Array.prototype.shuffle = function () {
    return this.map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}