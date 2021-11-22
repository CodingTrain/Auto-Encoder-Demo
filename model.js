import fs from 'fs'
import tf from '@tensorflow/tfjs-node'

/**
 * Abstraction for tfjs
 */
export class Model {
    pretrainedModelExists() {
        return fs.existsSync('models/autoencoder/model.json') && 
            fs.existsSync('models/encoder/model.json') &&
            fs.existsSync('models/decoder/model.json')
    }

    async load() {
        this.autoencoder = await tf.loadLayersModel('file://models/autoencoder/model.json')
        this.encoder = await tf.loadLayersModel('file://models/encoder/model.json')
        this.decoder = await tf.loadLayersModel('file://models/decoder/model.json')
    }

    configure() {
        const encoded = [
            tf.layers.dense({ units: 128, inputShape: [784], activation: "relu" }),
            tf.layers.dense({ units: 64, activation: "relu" }),
            tf.layers.dense({ units: 32, activation: "relu" }),
        ]
        const decoded = [
            tf.layers.dense({ units: 64, activation: "relu" }),
            tf.layers.dense({ units: 128, activation: "relu" }),
            tf.layers.dense({ units: 784, activation: "sigmoid" }),
        ]

        this.autoencoder = tf.sequential({ layers: [...encoded, ...decoded] })
        this.encoder = tf.sequential({ layers: encoded })

        const encoded_input = tf.layers.inputLayer({ inputShape: [32] })
        this.decoder = tf.sequential({ layers: [encoded_input, ...decoded] })

        this.autoencoder.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
        })
    }

    async train(x_train, epochs = 100) {
        await this.autoencoder.fit(x_train, x_train, {
            epochs,
            batchSize: 32,
            shuffle: true,
        })
        fs.mkdirSync('models')
        await this.autoencoder.save('file://models/autoencoder')
        await this.encoder.save('file://models/encoder')
        await this.decoder.save('file://models/decoder')
    }

    autoencode(data) {
        return this.decode(this.encode(data))
    }

    encode (data) {
        return this.encoder.predict(data)
    }

    decode(encoded) {
        return this.decoder.predict(encoded)
    }
}